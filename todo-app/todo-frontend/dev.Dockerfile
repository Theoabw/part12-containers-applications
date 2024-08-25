FROM node:lts

WORKDIR /usr/src/app

COPY . .

RUN npm ci

CMD ["npm", "run", "dev", "--", "--host"]
