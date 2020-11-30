import { iamClientLibService } from "../services/iam-client-lib-service";
import { IAssetIdentity } from "../types";
import { config } from "../config/config";

export class Vehicle {
    private readonly iamService: iamClientLibService

    constructor(assetID: IAssetIdentity) {
        this.iamService = new iamClientLibService(assetID.privateKey)
    }

    async requestPrequalification() {
        //TODO: Retrieve the vehicle model from OEM
        const vehicleInfo = [
            {
                key: "OEM",
                value: "Tesla",
            },
            {
                key: "model",
                value: "model3"
            }
        ]

        // This role should be an ENS namespace which is owned by the TSO, who is the issuer
        const prequalifiedRole = "prequalified.roles.flexmarket.apps.elia.iam.ewc"

        // Create a claim that contains the role
        let claimData = {
            fields: vehicleInfo,
            claimType: prequalifiedRole
        };

        // Maybe we can use the role directly instead needing to provide the DID
        console.log('createClaimRequest', {
            issuer: config.prequalificationIssuerDID,
            claim: claimData
        });

        // TODO: document why initialization is necessary.
        await this.iamService.iam.initializeConnection();

        await this.iamService.iam.createClaimRequest({
            issuer: [config.prequalificationIssuerDID],
            claim: claimData
        });
    }
}