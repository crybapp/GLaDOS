FROM debian:latest

WORKDIR /usr/src/app
COPY . .

RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - \
    apt-get update && apt-get install -y \
    python \
    make \
    clang \
    nodejs

RUN npm install