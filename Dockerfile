FROM node:22-alpine

WORKDIR /app

COPY package.json server.js ./
COPY public ./public

RUN mkdir -p /app/data && chown -R node:node /app

ENV NODE_ENV=production
ENV PORT=3537
ENV HOST=0.0.0.0
ENV DATA_FILE=/app/data/subscription-dock.json

USER node

EXPOSE 3537

CMD ["node", "server.js"]
