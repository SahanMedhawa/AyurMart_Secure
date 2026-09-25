FROM node:18-alpine

WORKDIR /app/AYURMART-Microservice/Server/Product-Service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7005

CMD ["npm", "start"]