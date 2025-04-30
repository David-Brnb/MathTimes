FROM node:lts AS builder

WORKDIR /web_dashboard

COPY package*.json ./

RUN npm install

COPY . .
# RUN npm run build
CMD [ "npm","run","dev" ]