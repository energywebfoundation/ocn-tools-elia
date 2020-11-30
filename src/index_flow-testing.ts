import { Vehicle } from './models/vehicle'
import { DIDFactory } from './models/dids/did-factory';
import { Database } from "./database"
import { Keys } from '@ew-did-registry/keys';
import { tokens } from "./data/tokens"

import { iamClientLibService } from './services/iam-client-lib-service';
import { config } from './config/config';

/**
 * THIS IS A SCRIPT TO BE ABLE TO EASILY DEBUG AND TEST THE CLAIMS ISSUANCE FLOW
 * ELIA-POC IS NOT NEEDED
 */

(async () => {
    // Creating new DID associated with a token/vehicle
    const db = new Database("cpo.db")
    const operatorKey = "0x388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418" // took key from elia-poc docker-compose
    const key = new Keys({ privateKey: operatorKey })
    const factory = new DIDFactory(key, db)
    const token = tokens[0]
    await factory.createVehicleDID(token)
  
    // Imagine that received request that contained the uid
    // Using the uid, the vehicle retrieves DID then creates claim request
    const uidOfToken0 = '91095845';
    const db2 = new Database("cpo.db");
    const assetID = db2.getAssetIdentity(uidOfToken0)
    if (!assetID) {
        return
    }
    const vehicle = new Vehicle(assetID)
    console.log(`vehicle private key: ${assetID.privateKey}`)
    try {
        await vehicle.requestPrequalification()
    }
    catch(e) {
        console.log(e)
    }
    console.log(vehicle)

    // At some point, the TSO check for requests of issuer (this will be done in EV dashboard)
    const privateKey = "f7aceed7ef9c4d2cb7a4c2cb5f8fb4db20f518321894019ac59374c160ff45ef" // PrivateKey of issuer TSO
    const iamService = new iamClientLibService(privateKey)
    await iamService.iam.initializeConnection();
    try {
        const requests = await iamService.iam.getIssuedClaims({did: config.prequalificationIssuerDID})
        console.info('requests', requests)
        
        // For a given vehicle, approve its requests:
        const requestsOfVehicle = requests.filter(r => r.requester == assetID.did)
        await Promise.all(requestsOfVehicle.map(r => {
            console.log(r)
            // TODO
            //iamService.iam.issueClaimRequest()
        }))
    }
    catch(e) {
        console.log(e)
    }

    // As vehicle, retrieve issued claims and add to DID document
    // Should be able to listen to nats messsage from iam-client-lib
})();
