FROM node:22

RUN npm install -g pnpm

WORKDIR /usr/local/app

COPY package.json pnpm-lock.yaml ./
COPY patches patches

RUN pnpm install

COPY . .

CMD ["pnpm", "run", "dev"]
