/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { Keys } from "@ew-did-registry/keys"
import { DefaultRegistry, ModuleImplementation, startBridge, stopBridge } from "@shareandcharge/ocn-bridge"
import * as yargs from "yargs"
import { MockAPI } from "./api/mock-api"
import { config } from "./config/config"
import { locations } from "./data/locations"
import { tokens } from "./data/tokens"
import { Database } from "./database"
import { DIDFactory } from "./models/dids/did-factory"
import { MockMonitorFactory } from "./models/mock-monitor-factory"
import { IDIDCache } from "./types"

const setAgreements = async (services: string[], registry: DefaultRegistry) => {
    for (const service of services) {
        try {
            await registry.permissions.createAgreement(service)
        } catch (err) {
            console.log(`service ${service} agreement failed: ${err.message}`)
        }
    }
}

const createAssetDIDs = async (operatorType: "msp" | "cpo", db: IDIDCache) => {
    if (!process.env.OCN_IDENTITY) {
        console.log("OCN_IDENTITY not set. Cannot create asset DIDs.")
        return
    }
    const key = new Keys({ privateKey: process.env.OCN_IDENTITY })
    const factory = new DIDFactory(key, db)
    if (operatorType === "msp") {
        for (const token of tokens) {
            try {
                await factory.createVehicleDID(token)
            } catch (err) {
                console.log(`Failed to create DID for vehicle(${token.uid}): ${err.message}`)
            }
        }
    }
    if (operatorType === "cpo") {
        for (const location of locations) {
            try {
                await factory.createChargePointDIDs(location)
            } catch (err) {
                console.log(`Failed to create DIDs for location(${location.id}): ${err.message}`)
            }
        }
    }

}

yargs
    .command("mock", "Start a mock OCPI party server", (context) => {
        context
            .option("cpo", {
                alias: "c",
                boolean: true,
                describe: "Charge Point Operator"
            })
            .option("msp", {
                alias: "m",
                boolean: true,
                describe: "e-mobility service provider"
            })
            .option("register-only", {
                alias: "r",
                boolean: true,
                describe: "register party to OCN then close"
            })
            .help()
    }, async (args) => {
        
        if (!args.cpo && !args.msp) {
            console.log("Need one of options \"cpo\", \"msp\"")
            process.exit(1)
        }
        const registry = new DefaultRegistry(config.ocn.stage, process.env.OCN_IDENTITY, process.env.OCN_SPENDER)
        const monitorFactory = new MockMonitorFactory()
        const api = new MockAPI(monitorFactory)

        if (args.cpo) {

            console.log("Starting CPO server...")

            const database = new Database("cpo.db")

            const cpoBridge = await startBridge({
                port: config.cpo.port,
                publicBridgeURL: config.cpo.publicIP,
                ocnNodeURL: config.ocn.node,
                roles: config.cpo.roles,
                modules: {
                    implementation: ModuleImplementation.CPO
                },
                pluggableAPI: api,
                pluggableDB: database,
                pluggableRegistry: registry,
                logger: true,
                signatures: true,
                signer: process.env.OCN_IDENTITY,
                tokenA: process.env.OCN_TOKEN_A
            })

            monitorFactory.setRequestService(cpoBridge.requests)

            // set agreements from config
            await setAgreements(config.cpo.services || [], registry)

            console.log("CPO server listening for OCPI requests")
            
            const token = await database.getTokenC()
            console.log(`To send requests as the CPO, use Authorization Token ${token}`)

            if (config.cpo.createAssetDIDs) {
                createAssetDIDs("cpo", database)
            }

            if (args.registerOnly) {
                console.log("Shutting down CPO server...")
                await stopBridge(cpoBridge)
            }
        } else if (args.msp) {

            console.log("Starting MSP server...")

            const database = new Database("msp.db")

            const mspServer = await startBridge({
                port: config.msp.port,
                publicBridgeURL: config.msp.publicIP,
                ocnNodeURL: config.ocn.node,
                roles: config.msp.roles,
                modules: {
                    implementation: ModuleImplementation.MSP
                },
                pluggableAPI: api,
                pluggableDB: database,
                pluggableRegistry: registry,
                logger: true,
                signatures: true,
                signer: process.env.OCN_IDENTITY,
                tokenA: process.env.OCN_TOKEN_A
            })

            monitorFactory.setRequestService(mspServer.requests)
            
            // set agreements from config
            await setAgreements(config.msp.services || [], registry)

            console.log("MSP server listening for OCPI requests")

            const token = await database.getTokenC()
            console.log(`To send requests as the MSP, use Authorization Token ${token}`)

            if (config.msp.createAssetDIDs) {
                createAssetDIDs("msp", database)
            }

            if (args.registerOnly) {
                console.log("Shutting down MSP server...")
                await stopBridge(mspServer)
            }
        }

    })
    .help()
    .parse()
