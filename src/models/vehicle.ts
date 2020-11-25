import { iamClientLibService } from "../services/iam-client-lib-service";

export class Vehicle {
    private readonly iamService: iamClientLibService

    constructor(private readonly uid: string) {
        console.log(this.uid);
        // const privateKey = retrievePrivateKey(uid)
        const privateKey = ""
        this.iamService = new iamClientLibService(privateKey)
    }

    requestPrequalification = async () => {
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

        //TODO: put in config, or better yet, lookup address using ENS
        const issuerDID = "did:ethr:0x829b91Fa3e91EA4448365ADA58C7Bad1Ff142866"

        // Create a claim that contains the role
        let claimData = {
            fields: vehicleInfo,
            claimType: prequalifiedRole
        };

        // Maybe we can use the role directly instead needing to provide the DID
        console.log('createClaimRequest', {
            issuer: issuerDID,
            claim: claimData
        });

        await this.iamService.iam.createClaimRequest({
            issuer: [issuerDID],
            claim: claimData
        });
    }
}