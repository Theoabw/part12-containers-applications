FROM node:lts

WORKDIR /usr/src/app

COPY . .

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "dev"]