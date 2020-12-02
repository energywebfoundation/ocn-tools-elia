import { IPluggableDB } from "@shareandcharge/ocn-bridge"

export interface IMockServerConfig {
    port: number
    publicIP: string
    roles: Array<{
        party_id: string
        country_code: string
        role: string
        business_details: { 
            name: string
        }
    }>
    services: string[]
    createAssetDIDs?: boolean
}

export interface IMockMSPServerConfig extends IMockServerConfig {
    // set number of generated assets to be created
    assetCount: number
}

export interface IOcnToolsConfig {
    ocn: {
        node: string
        stage: string
    },
    cpo: IMockServerConfig
    msp: IMockMSPServerConfig
    iam?: {
        cacheServerUrl: string
        rpcUrl: string
        chainId: number
        natsServerUrl: string
        natsProtocolPort: string
        webSocketsProtocolPort: string
    },
    evRegistry?: {
        address: string
        provider: string
    }
}

export interface IAssetIdentity {
    uid: string
    did: string
    privateKey: string
}

export interface IDIDCache extends IPluggableDB {

    /**
     * Resolves DID from asset ID
     * 
     * @param assetId unique id of asset (token UID, evse ID)
     */
    getAssetIdentity(assetId: string): IAssetIdentity | undefined

    /**
     * Store asset identity information
     */
    setAssetIdentity(identity: IAssetIdentity): void

}
