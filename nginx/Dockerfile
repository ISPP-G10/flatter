FROM nginx:1.19.0-alpine

RUN apk update
RUN apk add --no-cache git postgresql-dev libc-dev gcc nano bash
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

WORKDIR /usr/src/app