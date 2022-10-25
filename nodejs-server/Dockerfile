FROM node:alpine
WORKDIR /app
COPY package*.json .
COPY . .
RUN npm i
EXPOSE 5001
CMD ["npm", "run", "start"]