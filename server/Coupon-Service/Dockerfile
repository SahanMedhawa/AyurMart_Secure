FROM node:18-alpine

WORKDIR /app/AYURMART-Microservice/Server/Coupon-Service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7003

CMD ["npm", "start"]