FROM node:20.9.0-alpine 

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY . .
USER node
RUN npm install
COPY --chown=node:node . .

EXPOSE 3000
ENTRYPOINT npm start

