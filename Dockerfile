FROM keymetrics/pm2:12-alpine

# RUN apk add python make gcc g++
USER node
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

RUN node --version
COPY package*.json ./
RUN rm -rf node_modules
RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD pm2-runtime start pm2.json
