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

export const config = {
    ocn: {
        node: process.env.OCN_NODE_URL || "http://172.16.238.20:8080", // todo: replace other hardcoded values with env vars
        stage: "local"
    },
    cpo: {
        port: 3000,
        publicIP: "http://172.16.238.40:3000",
        roles: [
            {
                party_id: "EVC",
                country_code: "DE",
                role: "CPO",
                business_details: {
                    name: `Test CPO ${uuid.v4()}`
                }
            }
        ],
        services: ["0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e"],
        createAssetDIDs: true
    },
    msp: {
        port: 3001,
        publicIP: "http://172.16.238.30:3001",
        roles: [
            {
                party_id: "EVM",
                country_code: "DE",
                role: "EMSP",
                business_details: {
                    name: `Test MSP ${uuid.v4()}`
                }
            }
        ],
        services: [],
        createAssetDIDs: true
    },
    iam: {
        cacheServerUrl: 'https://volta-iam-cacheserver.energyweb.org/',
        rpcUrl: 'https://volta-internal-archive.energyweb.org',
        chainId: 73799,
        natsServerUrl: 'http://13.52.78.249:9222'
    }

}
