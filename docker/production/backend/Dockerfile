FROM python:3.8.13-alpine3.16

ENV CRYPTOGRAPHY_DONT_BUILD_RUST=1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update
RUN apk add --no-cache git postgresql-dev libc-dev gcc nano bash
RUN apk add --no-cache g++ make libffi-dev python3-dev build-base
RUN apk add py3-pip py3-pillow py3-cffi py3-brotli musl-dev python3-dev pango
RUN apk add chromium
RUN apk add chromium-chromedriver
RUN apk add gettext

RUN pip install gunicorn
RUN pip install ipdb
RUN pip install ipython

WORKDIR /usr/src/app/flatter-backend

COPY ./backend .

ENV DJANGO_ENV='production'
RUN pip install -U pip
RUN pip install -r requirements.txt
RUN chmod +x /usr/src/app/flatter-backend/entrypoint.sh