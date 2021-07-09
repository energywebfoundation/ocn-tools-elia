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
}
