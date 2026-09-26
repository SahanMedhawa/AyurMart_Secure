FROM node:18-alpine

WORKDIR /app/AYURMART-Microservice/client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]