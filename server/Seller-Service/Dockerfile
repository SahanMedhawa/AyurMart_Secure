FROM node:18-alpine

WORKDIR /app/AYURMART-Microservice/Server/Seller-Service

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 7004

CMD ["npm","start"]