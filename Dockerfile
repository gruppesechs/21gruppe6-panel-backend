FROM node:18-alpine
WORKDIR /app

RUN apk --no-cache add curl
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install -r --offline
RUN pnpm run build:ts

ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "pnpm", "run", "start:prod" ]
EXPOSE 3000
VOLUME [ "/app/keys" ]
