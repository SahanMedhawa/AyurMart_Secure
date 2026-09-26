FROM node:18-alpine

WORKDIR /app/AYURMART-Microservice/Server/Shopping-cart

COPY package*.json ./

RUN npm install 

COPY . . 

EXPOSE 7001

CMD ["npm","start"]