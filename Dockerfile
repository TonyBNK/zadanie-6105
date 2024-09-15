FROM node:20
WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY src ./src
COPY tsconfig.json ./tsconfig.json

RUN pnpm build

EXPOSE 8080

CMD ["dist/index.js"]

