import { RegistrationService } from '@energyweb/ocn-bridge'
import express from 'express'

/**
 * Simple Admin server to trigger OCPI connection with node
 *
 * @param db ocn-bridge DB API
 */

export const startAdminServer = async (registry: RegistrationService) => {
    const app = express()
    app.use(express.json())

    app.get(
        '/admin/status',
        async () => {
            const connected = await registry.isConnectedToNode()
            return { connected }
        }
    )

    app.post(
        '/admin/register',
        async (req) => {
            const { nodeURL, tokenA } = req.body;
            await registry.register(nodeURL, tokenA)
        }
    )

    return new Promise(async (resolve, reject) => {
        const server = app.listen(3030, async (err?: Error) => {
            err ? reject(err) : resolve(server)
        })
    })


}
