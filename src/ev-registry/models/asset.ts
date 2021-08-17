import { ENSNamespaceTypes, IRoleDefinition } from "iam-client-lib"
import { config } from "../../config/config"
import { IAssetIdentity } from "../../types"
import { IamClientLibFactory } from "../factories/iam-client-lib-factory"

export class Asset {
    private readonly assetID: IAssetIdentity
    private readonly logPrefix: string

    constructor(assetID: IAssetIdentity) {
        this.assetID = assetID
        this.logPrefix = `[Asset] ${this.assetID.did}`
    }

    public async requestPrequalification() {
        console.log(`${this.logPrefix} is requestingPrequalification`)

        const assetIamClient = await IamClientLibFactory.create({
            privateKey: this.assetID.privateKey,
            cacheServerUrl: config.prequalification.asset_claims_iam.cacheServerUrl
        })
        const role = await assetIamClient.getDefinition({ type: ENSNamespaceTypes.Roles, namespace: config.prequalification.prequalifcationRole })
        if (!role) {
            throw Error(`role ${config.prequalification.prequalifcationRole} not known to cache server`)
        }
        const claimData = {
            fields: [],
            claimType: config.prequalification.prequalifcationRole,
            claimTypeVersion: (role as IRoleDefinition).version
        }
        console.log(`${this.logPrefix} is creating claim request`, {
            claim: JSON.stringify(claimData)
        })
        await assetIamClient.createClaimRequest({
            claim: claimData
        })

        console.log(`${this.logPrefix} claim request created`)
    }

    public async publishPublicClaim(token: string): Promise<string | null> {
        const assetIamClient = await IamClientLibFactory.create({
            privateKey: this.assetID.privateKey,
            cacheServerUrl: config.prequalification.asset_claims_iam.cacheServerUrl
        })
        const ipfsUrl = await assetIamClient.publishPublicClaim({ token })
        console.log(`${this.logPrefix} published claim to DID Document`)
        return ipfsUrl
    }
}