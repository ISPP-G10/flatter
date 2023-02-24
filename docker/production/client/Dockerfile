FROM node:lts-alpine

RUN apk update
RUN apk add --no-cache git nano
RUN apk add --no-cache g++ make

WORKDIR /app

RUN git clone https://github.com/javiercavlop/flatter.git .
RUN git pull

WORKDIR /app/client

ENV PATH /app/node_modules/.bin:$PATH

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]