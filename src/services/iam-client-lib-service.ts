// import { config } from "../config/config"
// import { CacheServerClient, IAM } from 'iam-client-lib';

export class iamClientLibService {
    readonly iam;

    constructor(privateKey: string) {
        console.log(privateKey)
        // const cacheClient = new CacheServerClient({
        //     url: config.iam.cacheServerUrl
        // });

        // // Because iam-client-lib is running on the server, the private key is passed in directly
        // new IAM({
        //     privateKey: privateKey,
        //     natsServerUrl: config.iam.natsServerUrl,
        //     rpcUrl: config.iam.rpcUrl,
        //     chainId: config.iam.chainId,
        //     cacheClient
        // });
    }
}