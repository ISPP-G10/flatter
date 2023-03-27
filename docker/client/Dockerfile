FROM node:lts-alpine

RUN apk update
RUN apk add --no-cache git nano
RUN apk add --no-cache g++ make

WORKDIR /usr/src/app/flatter-client

COPY ./client .

ENV PATH /usr/src/app/flatter-client/node_modules/.bin:$PATH

RUN yarn install
RUN yarn global add serve

ARG API_SERVER
ENV REACT_APP_API_SERVER=${API_SERVER}
ENV NODE_ENV=${NODE_ENV}
RUN yarn build