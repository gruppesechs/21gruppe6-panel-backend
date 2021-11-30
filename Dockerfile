FROM node:17-alpine
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY prisma/schema.prisma ./prisma/
RUN npm ci --silent

COPY . ./
RUN npm run build:ts

EXPOSE 3000
ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "npm", "run", "start:prod" ]
