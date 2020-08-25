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

import { IToken } from "@shareandcharge/ocn-bridge";
import { config } from "../config/config";
import { extractMSP } from "../tools/tools";

const msp = extractMSP(config.msp.roles)

export const tokens: IToken[] = [
    {
        country_code: msp.country_code,
        party_id: msp.party_id,
        uid: "00020304",
        type: "APP_USER",
        contract_id: `${msp.country_code}-${msp.party_id}-XY00020304`,
        issuer: msp.business_details.name,
        whitelist: "NEVER",
        valid: true,
        last_updated: new Date().toISOString()
    },
    {
        country_code: msp.country_code,
        party_id: msp.party_id,
        uid: "12131415",
        type: "APP_USER",
        contract_id: `${msp.country_code}-${msp.party_id}-XY12131415`,
        issuer: msp.business_details.name,
        whitelist: "NEVER",
        valid: true,
        last_updated: new Date().toISOString()
    },
    {
        country_code: msp.country_code,
        party_id: msp.party_id,
        uid: "2122232425",
        type: "RFID",
        contract_id: `${msp.country_code}-${msp.party_id}-XY2122232425`,
        issuer: msp.business_details.name,
        whitelist: "NEVER",
        valid: true,
        last_updated: new Date().toISOString()
    }
]
