FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install && npm cache clean --force

EXPOSE 3000

RUN npm run build

ENV TZ 'America/Sao_Paulo'

CMD ["npm", "run", "start:prod"]
