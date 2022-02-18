import { RegistrationService } from '@energyweb/ocn-bridge'
import express from 'express'

/**
 * Simple Admin server to trigger OCPI connection with node
 *
 * @param db ocn-bridge DB API
 */

export const startAdminServer = async (port: number, registry: RegistrationService) => {
    const app = express()
    app.use(express.json())

    app.get(
        '/admin/status',
        async (_, res) => {
            const connected = await registry.isConnectedToNode()
            res.json({ connected })
        }
    )

    app.post(
        '/admin/register',
        async (req, res) => {
            const { nodeURL, tokenA } = req.body;
            await registry.register(nodeURL, tokenA)
            res.send('OK')
        }
    )

    return new Promise(async (resolve, reject) => {
        const server = app.listen(port, async (err?: Error) => {
            err ? reject(err) : resolve(server)
        })
    })


}
