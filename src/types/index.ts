import { IPluggableDB } from "@shareandcharge/ocn-bridge"

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
