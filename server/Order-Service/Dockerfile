FROM node:18-alpine

WORKDIR /app/AYURMART-Microservice/Server/Order-Service

COPY package*.json ./

RUN npm install 

COPY . . 

EXPOSE 7006

CMD ["npm","start"]