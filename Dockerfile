FROM node:17-alpine
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY prisma/schema.prisma ./prisma/
RUN npm ci --silent

COPY . ./
RUN npm run build:ts

ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "npm", "run", "start:prod" ]
EXPOSE 3000
VOLUME [ "/app/keys" ]
