import { IamClientLibFactory } from "../services/iam-client-lib-service";
import { IAssetIdentity } from "../types";
import { config } from "../config/config";
import { IAM } from "iam-client-lib";

export class Asset {
    private readonly iamClient: IAM
    private readonly assetID: IAssetIdentity
    private readonly logPrefix: string

    constructor(assetID: IAssetIdentity) {
        this.assetID = assetID
        this.iamClient = IamClientLibFactory.create(assetID.privateKey);
        this.logPrefix = `[Asset] ${this.assetID.did}`
    }

    async requestPrequalification() {
        console.log(`${this.logPrefix} is requestingPrequalification`)


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

        let claimData = {
            fields: vehicleInfo,
            claimType: config.prequalification.prequalifcationRole
        };

        // TODO: document why initialization is necessary.
        if (!this.iamClient.isConnected()) {
            await this.iamClient.initializeConnection();
        }

        // TODO: Can we request that it be issued by someone with a particular role, not a specific DID?
        console.log(`${this.logPrefix} is creating claim request`, {
            issuer: config.prequalification.prequalificationIssuerDID,
            claim: JSON.stringify(claimData)
        });
        await this.iamClient.createClaimRequest({
            issuer: [config.prequalification.prequalificationIssuerDID],
            claim: claimData
        });

        console.log(`${this.logPrefix} claim request created`);
    }

    async publishPublicClaim(token: string): Promise<string | null> {
        // TODO: document why initialization is necessary.
        if (!this.iamClient.isConnected()) {
            await this.iamClient.initializeConnection();
        }
        const ipfsUrl = await this.iamClient.publishPublicClaim({ token })
        console.log(`${this.logPrefix} published claim to DID Document`)
        return ipfsUrl
    }
}