FROM node:20-alpine

RUN apk update && \
    apk add --no-cache git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3333

CMD ["node", "dist/index.js"]
