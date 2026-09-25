FROM node:18-alpine

WORKDIR /app/AYURMART-Microservice/Server/UserAuth-Service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7002

CMD ["npm", "start"]