FROM node:lts-alpine

RUN apk add git python make g++

COPY . /tools
WORKDIR /tools

RUN npm clean-install
RUN ls node_modules
RUN ls node_modules/@shareandcharge
RUN npm run build


ENTRYPOINT [ "node", "dist/index.js" ]