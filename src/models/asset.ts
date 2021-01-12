import { IamClientLibFactory } from "../factories/iam-client-lib-factory";
import { IAssetIdentity } from "../types";
import { config } from "../config/config";

export class Asset {
    private readonly assetID: IAssetIdentity
    private readonly logPrefix: string

    constructor(assetID: IAssetIdentity) {
        this.assetID = assetID
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

        const userIamClient = await IamClientLibFactory.create({
            privateKey: this.assetID.privateKey,
            cacheServerUrl: config.prequalification.user_claims_iam.cacheServerUrl
        });
        console.log(`${this.logPrefix}, retrieving DIDs with role: ${config.prequalification.prequalificationIssuerRole}`)
        const tsoDids = await userIamClient.getRoleDIDs({ namespace: config.prequalification.prequalificationIssuerRole })
        if (tsoDids?.length < 1) {
            console.log(`${this.logPrefix}, no DIDs with issuer role found and so no claim request can be created`)
            return
        }

        console.log(`${this.logPrefix} is creating claim request`, {
            issuer: tsoDids,
            claim: JSON.stringify(claimData)
        });
        const assetIamClient = await IamClientLibFactory.create({
            privateKey: this.assetID.privateKey,
            cacheServerUrl: config.prequalification.asset_claims_iam.cacheServerUrl
        });
        await assetIamClient.createClaimRequest({
            issuer: tsoDids,
            claim: claimData
        });

        console.log(`${this.logPrefix} claim request created`);
    }

    async publishPublicClaim(token: string): Promise<string | null> {
        const assetIamClient = await IamClientLibFactory.create({
            privateKey: this.assetID.privateKey,
            cacheServerUrl: config.prequalification.asset_claims_iam.cacheServerUrl
        });
        const ipfsUrl = await assetIamClient.publishPublicClaim({ token })
        console.log(`${this.logPrefix} published claim to DID Document`)
        return ipfsUrl
    }
}