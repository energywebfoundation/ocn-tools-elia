import { config } from "../../config/config"
import { IAM, CacheServerClient } from 'iam-client-lib';

export class IamClientLibFactory {

    /**
     * Returns an initialized iam-client
     * @param privateKey 
     * @param isForUserClaims 
     */
    public static async create({ privateKey, cacheServerUrl }: IamClientParams) {
        const cacheClient = new CacheServerClient({
            url: cacheServerUrl 
        });

        // Because iam-client-lib is running on the server, the private key is passed in directly
        const iamClient = new IAM({
            privateKey: privateKey,
            rpcUrl: config.prequalification.provider,
            chainId: config.prequalification.chainId,
            cacheClient
        });

        // TODO: document why initialization is necessary.
        await iamClient.initializeConnection();
        return iamClient;
    }
}

type IamClientParams = {
    cacheServerUrl: string,
    privateKey: string
}