FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", ".next/standalone/server.js"]
