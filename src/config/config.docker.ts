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
        node: process.env.OCN_NODE_URL || "http://172.16.238.20:8080",
        stage: process.env.OCN_STAGE || "local"
    },
    cpo: {
        port: parseInt(process.env.CPO_PORT || "3000", 10),
        publicIP: process.env.CPO_PUBLIC_IP || "http://172.16.238.40:3000",
        roles: [
            {
                party_id: process.env.CPO_PARTY_ID || "EVC",
                country_code: process.env.CPO_COUNTRY_CODE || "DE",
                role: "CPO",
                business_details: {
                    name: process.env.CPO_NAME || `Test CPO ${uuid.v4()}`
                }
            }
        ],
        services: ["0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e"],
    },
    msp: {
        port: parseInt(process.env.MSP_PORT || "3001", 10),
        publicIP: process.env.MSP_PUBLIC_IP || "http://172.16.238.30:3001",
        roles: [
            {
                party_id: process.env.MSP_PARTY_ID || "EVM",
                country_code: process.env.MSP_COUNTRY_CODE || "DE",
                role: "EMSP",
                business_details: {
                    name: process.env.MSP_NAME || `Test MSP ${uuid.v4()}`
                }
            }
        ],
        services: [],
        assetCount: parseInt(process.env.MSP_ASSET_COUNT || '20', 10),
    },
}
