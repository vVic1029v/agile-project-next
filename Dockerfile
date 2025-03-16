FROM node:23-alpine3.20

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
# RUN npx prisma db push
# RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]
