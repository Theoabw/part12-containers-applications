FROM node:lts AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run test

RUN npm run build

FROM node:lts AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

RUN npm ci --only=production

RUN npm install -g serve

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

CMD ["serve", "-s", "dist", "-l", "3000"]