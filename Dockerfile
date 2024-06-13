FROM node:22.2.0-alpine3.20

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

CMD ["npm", "run", "dev"]