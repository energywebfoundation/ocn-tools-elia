import { connect, Client } from "nats";
import { config } from "../config/config"

/**
 * Creates and monitors a NATS connection
 * Event handling code taken from: https://docs.nats.io/developing-with-nats/events/events
 */
export class NatsConnectionFactory {
    static readonly logPrefix = "[NATS Event]";

    static create(): Client | undefined {
        try {
            if (!config.prequalification.iam) {
                console.log("[NATS] IAM not configured. Events will not be receieved.");
                return
            }
            const url = `${config.prequalification.iam.natsServerUrl}:${config.prequalification.iam.natsProtocolPort}`;
            console.log(`[NATS] Connecting to ${url}`);
            const nc = connect({ url: `nats://${url}` });

            nc.on("error", (err) => {
                console.error(`${NatsConnectionFactory.logPrefix} error occured`, err);
            });
            nc.on("connect", () => {
                console.log(`${NatsConnectionFactory.logPrefix} client connected`);
            });

            nc.on("disconnect", () => {
                console.log(`${NatsConnectionFactory.logPrefix} client disconnected`);
            });

            nc.on("reconnecting", () => {
                console.log(`${NatsConnectionFactory.logPrefix} client reconnecting`);
            });

            nc.on("reconnect", () => {
                console.log(`${NatsConnectionFactory.logPrefix} client reconnected`);
            });

            nc.on("close", () => {
                console.log(`${NatsConnectionFactory.logPrefix} client closed`);
            });

            nc.on("permission_error", (err) => {
                console.error(`${NatsConnectionFactory.logPrefix} permission_error`, err);
            });
            return nc;
        } catch (err) {
            console.error(`${NatsConnectionFactory.logPrefix} error creating connection`, err)
            return undefined;
        }
    }
}
