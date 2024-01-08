FROM node:14.21.3

RUN mkdir -p /usr/logixapi && chown -R node:node /usr/logixapi

WORKDIR /usr/logixapi

COPY package.json yarn.lock ./

USER node

RUN yarn install

COPY --chown=node:node . .

EXPOSE 3000
