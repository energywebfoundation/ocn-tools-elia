FROM node:lts-alpine

RUN apk add git python make g++ sqlite

WORKDIR /ocn-tools
COPY . .

# needed to allow ocn-bridge dependency installation
RUN npm config set unsafe-perm true 

RUN npm install
RUN npm run build

RUN chmod +x ./wait-for-node.sh

ENTRYPOINT [ "node", "dist/index.js" ]
