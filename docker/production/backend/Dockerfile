FROM python:3.8.13-alpine3.16

ENV CRYPTOGRAPHY_DONT_BUILD_RUST=1

RUN apk update
RUN apk add --no-cache git postgresql-dev libc-dev gcc nano
RUN apk add --no-cache g++ make libffi-dev python3-dev build-base
RUN apk add py3-pip py3-pillow py3-cffi py3-brotli musl-dev python3-dev pango
RUN apk add chromium
RUN apk add chromium-chromedriver
RUN apk add gettext

RUN pip install gunicorn
RUN pip install ipdb
RUN pip install ipython

WORKDIR /app

RUN git clone https://github.com/javiercavlop/flatter.git .
RUN git pull

WORKDIR /app/backend

RUN pip install -U pip
RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["gunicorn", "-w 5", "backend.wsgi", "--timeout=500", "-b 0.0.0.0:5000"]
