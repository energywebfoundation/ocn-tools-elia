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

import { IRole } from "@energyweb/ocn-bridge";

export const extractCPO = (roles: IRole[]): IRole => {
    const cpo = roles.find((role) => role.role === "CPO")
    if (!cpo) {
        throw Error("No CPO role provided in \"config.cpo.roles\"")
    }
    return cpo
}

export const extractMSP = (roles: IRole[]): IRole => {
    const msp = roles.find((role) => role.role === "EMSP")
    if (!msp) {
        throw Error("No MSP role provided in \"config.msp.roles\"")
    }
    return msp
}
