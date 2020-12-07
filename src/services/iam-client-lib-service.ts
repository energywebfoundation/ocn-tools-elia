import { config } from "../config/config"
import { IAM, CacheServerClient } from 'iam-client-lib';

export class IamClientLibFactory {
    public static create(privateKey: string) {
        if (!config.iam) {
            throw Error("No IAM configured. Unable to connect to IAM Cache Client.")
        }
        const cacheClient = new CacheServerClient({
            url: config.iam.cacheServerUrl
        });

        // Because iam-client-lib is running on the server, the private key is passed in directly
        return new IAM({
            privateKey: privateKey,
            natsServerUrl: config.iam.natsServerUrl + ':' + config.iam.webSocketsProtocolPort,
            rpcUrl: config.iam.rpcUrl,
            chainId: config.iam.chainId,
            cacheClient
        });
    }
}