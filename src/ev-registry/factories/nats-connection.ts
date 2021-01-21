import { connect, Client } from "nats";
import { config } from "../../config/config"

/**
 * Creates and monitors a NATS connection
 * Event handling code taken from: https://docs.nats.io/developing-with-nats/events/events
 */
export class NatsConnection {
    static readonly logPrefix = "[NATS Connection]";
    private readonly createSubscriptions: (Client) => void;
    private natsClient: Client;

    constructor({ createSubscriptions }: { createSubscriptions: (Client) => void }) {
        this.createSubscriptions = createSubscriptions;
        this.natsClient = this.connect();
    }

    private connect(): Client {
        const assetIamConfig = config.prequalification.asset_claims_iam;
        const url = `${assetIamConfig.natsServerUrl}:${assetIamConfig.natsProtocolPort}`;
        console.log(`[NATS] Connecting to ${url}`);
        const nc = connect({ url: `nats://${url}` });

        nc.on("error", (err) => {
            console.error(`${NatsConnection.logPrefix} error occured`, err);
            this.reconnect();
        });
        nc.on("connect", () => {
            console.log(`${NatsConnection.logPrefix} client connected. Creating subscriptions.`);
            this.createSubscriptions(nc);
        });

        nc.on("disconnect", () => {
            console.log(`${NatsConnection.logPrefix} client disconnected`);
        });

        nc.on("reconnecting", () => {
            console.log(`${NatsConnection.logPrefix} client reconnecting`);
        });

        nc.on("reconnect", () => {
            console.log(`${NatsConnection.logPrefix} client reconnected`);
        });

        nc.on("close", () => {
            console.log(`${NatsConnection.logPrefix} client closed`);
            this.reconnect();
        });

        nc.on("permission_error", (err) => {
            console.error(`${NatsConnection.logPrefix} permission_error`, err);
        });
        return nc;
    }

    private reconnect() {
        console.log(`${NatsConnection.logPrefix} draining and closing client`);
        this.natsClient.removeAllListeners();
        this.natsClient.drain();
        this.natsClient.close();

        // Using setTimeout because want to keep reference to Client so that it has time to close.
        // Also want to added buffer reconnection in the event of an error. Maybe better would be an expontential back-off.
        const self = this;
        setTimeout(function() {
            console.log(`${NatsConnection.logPrefix} reconnecting client`);
            self.natsClient = self.connect();
        }, 5 * 1000)
    }
}
