FROM node:lts-alpine

RUN apk update
RUN apk add --no-cache git nano
RUN apk add --no-cache g++ make

WORKDIR /usr/src/app/flatter-client

COPY ./client .

ENV PATH /usr/src/app/flatter-client/node_modules/.bin:$PATH

RUN yarn install

RUN yarn global add serve
RUN yarn build