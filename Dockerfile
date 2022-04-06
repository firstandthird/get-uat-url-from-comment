FROM node:16

COPY . .

RUN npm install --production

ENTRYPOINT ["node", "/index.js"]
