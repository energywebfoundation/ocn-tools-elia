import { config } from "../config/config"
import { IAM, CacheServerClient } from 'iam-client-lib';

export class IamClientLibFactory {
    public static create(privateKey: string) {
        if (!config.prequalification.iam) {
            throw Error("No IAM configured. Unable to connect to IAM Cache Client.")
        }
        const iam = config.prequalification.iam
        const cacheClient = new CacheServerClient({
            url: iam.cacheServerUrl
        });

        // Because iam-client-lib is running on the server, the private key is passed in directly
        return new IAM({
            privateKey: privateKey,
            natsServerUrl: iam.natsServerUrl + ':' + iam.webSocketsProtocolPort,
            rpcUrl: config.prequalification.provider,
            chainId: iam.chainId,
            cacheClient
        });
    }
}