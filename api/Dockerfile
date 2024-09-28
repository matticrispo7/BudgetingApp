#FROM --platform=linux/arm64 node:alpine
FROM node:alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY ./src ./src
CMD [ "npm", "start" ]