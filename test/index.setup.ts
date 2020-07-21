import { DatabaseMock } from "./mock/database.mock"
import { IRole } from "@shareandcharge/ocn-bridge/dist/models/ocpi/credentials"
import { MockAPI } from "../src/api/mock-api"
import { PushService } from "@shareandcharge/ocn-bridge/dist/services/push.service"
import { IBridgeConfigurationOptions, DefaultRegistry } from "@shareandcharge/ocn-bridge"
import { ModuleImplementation } from "@shareandcharge/ocn-bridge/dist/models/bridgeConfigurationOptions"

const registry = new DefaultRegistry("local")

const cpoDb = new DatabaseMock()
const mspDb = new DatabaseMock()

const cpo: IRole = {
    country_code: "DE",
    party_id: "ABC",
    role: "CPO",
    business_details: {
        name: "Test CPO GmbH"
    }
}

const msp: IRole = {
    country_code: "CH",
    party_id: "XYZ",
    role: "EMSP",
    business_details: {
        name: "Test MSP AG"
    }
}

const cpoMockAPI = new MockAPI(new PushService(cpoDb, cpo))
const mspMockAPI = new MockAPI(new PushService(mspDb, msp))

export const cpoConfig: IBridgeConfigurationOptions = {
    port: 3001,
    publicBridgeURL: "http://localhost:3001",
    ocnNodeURL: "http://localhost:8080",
    roles: [cpo],
    modules: {
        implementation: ModuleImplementation.CPO
    },
    pluggableAPI: cpoMockAPI,
    pluggableDB: cpoDb,
    pluggableRegistry: registry,
    logger: false,
    dryRun: true
}

export const mspConfig: IBridgeConfigurationOptions = {
    port: 3002,
    publicBridgeURL: "http://localhost:3002",
    ocnNodeURL: "http://localhost:8081",
    roles: [msp],
    modules: {
        implementation: ModuleImplementation.MSP
    },
    pluggableAPI: mspMockAPI,
    pluggableDB: mspDb,
    pluggableRegistry: registry,
    logger: false,
    dryRun: true
}