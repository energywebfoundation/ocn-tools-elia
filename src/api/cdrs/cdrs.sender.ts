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

import { IChargeDetailRecord } from "@shareandcharge/ocn-bridge/dist/models/ocpi/cdrs";
import { cdrs } from "../../data/cdrs"
import { IPaginationResponse } from "@shareandcharge/ocn-bridge/dist/models/pluggableAPI";

export class CdrsSender {

    public async getList(): Promise<IPaginationResponse<IChargeDetailRecord[]>> {
        return {
            data: cdrs
        }
    }

}