import { config } from "../config/config"
import { IAM, CacheServerClient } from 'iam-client-lib';

export class iamClientLibService {
    readonly iam: IAM;

    constructor(privateKey: string) {
        console.log(privateKey)
        const cacheClient = new CacheServerClient({
            url: config.iam.cacheServerUrl
        });

        // Because iam-client-lib is running on the server, the private key is passed in directly
        this.iam = new IAM({
            privateKey: privateKey,
            natsServerUrl: config.iam.natsServerUrl + ':' + config.iam.webSocketsProtocolPort,
            rpcUrl: config.iam.rpcUrl,
            chainId: config.iam.chainId,
            cacheClient
        });
    }
}