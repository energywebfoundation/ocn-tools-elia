export const config = {
    prequalification: {
        prequalificationIssuerRole: process.env.PREQUALIFICATION_ISSUER_ROLE ?? "tso.roles.evdashboard.apps.elia.iam.ewc",
        prequalifcationRole: process.env.PREQUALIFICATION_ROLE ?? "prequalified.roles.flexmarket.apps.elia.iam.ewc",
        provider: process.env.EWC_RPC_URL ?? "https://volta-internal-archive.energyweb.org",
        chainId: 73799,
        user_claims_iam: {
            cacheServerUrl: process.env.USER_CACHE_SERVER_URL ?? "https://identitycache-dev.energyweb.org/",
        },
        asset_claims_iam: {
            cacheServerUrl: process.env.ASSET_CACHE_SERVER_URL ?? "http://host.docker.internal:80",
            natsServerUrl: process.env.NATS_SERVER_URL ?? "host.docker.internal",
            natsProtocolPort: process.env.NATS_PROTOCOL_PORT ?? "4222",
        }
    },
    evRegistry: {
        address: process.env.EV_REGISTRY_ADDRESS || "0x9fbda871d559710256a2502a2517b794b482db40",
        provider: process.env.EV_REGISTRY_PROVIDER || "http://172.16.238.10:8544"
    }
}
