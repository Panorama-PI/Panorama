FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --chown=node:node app.js ./app.js
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public

USER node
EXPOSE 3333
CMD ["npm", "start"]
