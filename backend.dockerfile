FROM node:20-alpine
WORKDIR /usr/src/app
COPY ./back/. .
RUN npm install
RUN rm -rf node_modules/sqlite3
RUN npm i sqlite3
ENV NODE_ENV=production
RUN npm run build
RUN npm install pm2 -g
EXPOSE 3001
VOLUME ./back/db/production ./db/production
CMD ["npm", "run", "pm2"]