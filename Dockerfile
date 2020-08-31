FROM node:lts AS builder

WORKDIR /ocn-tools

COPY . .

# needed to allow ocn-bridge dependency installation
RUN npm config set unsafe-perm true 

RUN npm install
RUN npm run build

RUN npm prune --production

# production image
FROM node:lts-alpine

RUN apk add curl

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

ENV NODE_ENV=production

COPY --from=builder /ocn-tools/node_modules ./node_modules
COPY --from=builder /ocn-tools/dist ./dist
COPY --from=builder --chown=node /ocn-tools/wait-for-node.sh ./

RUN chmod +x ./wait-for-node.sh

CMD [ "node", "dist/index.js" ]
