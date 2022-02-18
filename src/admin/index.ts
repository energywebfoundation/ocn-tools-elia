import { RegistrationService } from '@energyweb/ocn-bridge'
import express from 'express'
import uuid from 'uuid'

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

    // need to fix: produces error fetching data (getNode) from registry
    app.post(
        '/admin/register',
        async (req, res) => {
            const { nodeURL, tokenA } = req.body;
            try {
                await registry.register(nodeURL, Buffer.from(tokenA).toString('base64'))
                res.send('OK')
            } catch (err) {
                res.send('Error occurred trying to register party')
            }
        }
    )


    // gets around above error (need to set party in OCN Registry beforehand)
    app.post(
        '/admin/connect',
        async (req, res) => {
            const { baseURL, nodeURL, roles, tokenA } = req.body;
            const token = Buffer.from(tokenA).toString('base64')
            await registry.getNodeEndpoints(nodeURL + '/ocpi/versions', token)
            await registry.connectToNode({
                token: uuid.v4(),
                url: baseURL + '/ocpi/versions',
                roles,
            }, token)
            res.send('OK')
        }
    )

    return new Promise(async (resolve, reject) => {
        const server = app.listen(port, async (err?: Error) => {
            err ? reject(err) : resolve(server)
        })
    })


}
