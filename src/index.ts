import { connect, JSONCodec } from "nats.ws";

(async () => {
  const natsConnection = await connect({ servers: 'wss://dsb-dev.energyweb.org' });
  const PREQUALIFICATION_REQUEST_TOPIC = "prequalification.exchange";
  const subscription = natsConnection.subscribe(
    `*.${PREQUALIFICATION_REQUEST_TOPIC}`
  );
  for await (const msg of subscription) {
    const jsonCodec = JSONCodec()
    const decodedMessage = jsonCodec.decode(msg.data);
    console.log(decodedMessage)
  }
})();