import "mocha"
import { assert } from "chai"
import fetch from 'node-fetch'
import { startBridge, stopBridge, IBridgeConfigurationOptions } from "@shareandcharge/ocn-bridge"
import { cpoConfig, mspConfig } from "./index.setup"


describe("Bridge Integration", () => {

    async function shouldLoad(config: IBridgeConfigurationOptions) {
        const server = await startBridge(config)

        const result = await fetch(config.publicBridgeURL)
        const text = await result.text()
        assert.equal(text, "OCN Bridge v0.1.0")

        await stopBridge(server)
    }

    it("should run cpo backend", async () => shouldLoad(cpoConfig))

    it("should run msp backend", async () => shouldLoad(mspConfig))


})