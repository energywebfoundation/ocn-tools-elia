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
import * as uuid from "uuid"
import { IOcnToolsConfig } from "../types"

export const config: IOcnToolsConfig = {
    ocn: {
        node: "http://localhost:8080",
        stage: "local"
    },
    cpo: {
        port: 3000,
        publicIP: "http://localhost:3000",
        roles: [
            {
                party_id: "CPO",
                country_code: "CH",
                role: "CPO",
                business_details: {
                    name: `Test CPO ${uuid.v4()}`
                }
            }
        ],
        services: [],
        createAssetDIDs: false
    },
    msp: {
        port: 3001,
        publicIP: "http://localhost:3001",
        roles: [
            {
                party_id: "MSP",
                country_code: "CH",
                role: "EMSP",
                business_details: {
                    name: `Test MSP ${uuid.v4()}`
                }
            }
        ],
        services: [],
        createAssetDIDs: false,
        assetCount: 10
    },
    iam: {
        cacheServerUrl: "https://volta-iam-cacheserver.energyweb.org/",
        rpcUrl: "https://volta-internal-archive.energyweb.org",
        chainId: 73799,
        natsServerUrl: "13.52.78.249",
        natsProtocolPort: "4222",
        webSocketsProtocolPort: "9222"
    },
    prequalification: {
        prequalificationIssuerDID: "did:ethr:0x322Bd528CEFb73ed1baec2aC38697ECECAe41710",
        prequalifcationRole: "prequalified.roles.flexmarket.apps.elia.iam.ewc"
    },
    evRegistry: {
        address: "0x9fbda871d559710256a2502a2517b794b482db40",
        provider: "http://localhost:8544"
    }
}