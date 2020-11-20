import { Methods } from "@ew-did-registry/did"
import { DIDDocumentFull, IDIDDocumentFull } from "@ew-did-registry/did-document"
import { abi1056, address1056, Operator } from "@ew-did-registry/did-ethr-resolver"
import { IResolverSettings, ProviderTypes } from "@ew-did-registry/did-resolver-interface"
import { Keys } from "@ew-did-registry/keys"
import { Wallet } from "ethers"
import { IAssetIdentity, IDIDCache } from "../../types"

export class DID {
 
    /**
     * Creates or retreives a DID/Document for an asset
     * 
     * @param assetID token UID or evse ID
     * @param operatorKey key of asset operator ('controller' of DID)
     * @param db interface with get/set identity cache methods
     */
    public static async init(assetID: string, operatorKey: Keys, db: IDIDCache): Promise<DID> {
        const did = new DID(assetID, operatorKey, db)
        await did.init()
        return did
    }

    /**
     * DID of asset
     */
    public did?: string
    /**
     * DID Document of asset
     */
    public document?: IDIDDocumentFull

    private resolverSettings: IResolverSettings = {
        provider: {
            uriOrInfo: "https://volta-rpc.energyweb.org",
            type: ProviderTypes.HTTP
        },
        method: Methods.Erc1056,
        abi: abi1056,
        address: address1056
    }

    constructor(
        private assetID: string,
        private operatorKey: Keys,
        private db: IDIDCache
    ) {}

    /**
     * Checks if identity has already been created,
     * creates or retrieves did and document
     */
    private async init(): Promise<void> {
        const existent = this.db.getAssetIdentity(this.assetID)
        if (existent) {
            await this.getDocument(existent)
        } else {
            await this.createDocument()
        }
    }

    /**
     * Resolves an asset's DID using the MSP/CPO as operator
     * 
     * @param asset get DID using asset identity details stored in cache
     */
    private async getDocument(asset: IAssetIdentity): Promise<void> {
        const wallet = new Wallet(asset.privateKey)
        this.did = `did:${Methods.Erc1056}:${wallet.address}`
        const operator = new Operator(this.operatorKey, this.resolverSettings)
        this.document = new DIDDocumentFull(this.did, operator)
    }

    /**
     * Creates a DID for asset using MSP/CPO as operator
     */
    private async createDocument(): Promise<void> {
        const wallet = Wallet.createRandom()
        this.did = `did:${Methods.Erc1056}:${wallet.address}`
        const operator = new Operator(this.operatorKey, this.resolverSettings)
        this.document = new DIDDocumentFull(this.did, operator)
        await this.document.create()
        this.db.setAssetIdentity({
            uid: this.assetID,
            did: this.did,
            privateKey: wallet.privateKey
        })
    }

}
