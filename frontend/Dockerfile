FROM node:latest

ENV PORT 3000

ENV NODE_ENV production

RUN mkdir -p /usr/src/app

WORKDIR usr/src/app

COPY package.json /usr/src/app/package.json

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD "npm" "start"
