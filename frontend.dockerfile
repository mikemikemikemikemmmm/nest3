FROM node:lts-alpine as builder
WORKDIR /client
COPY ./client/package.json ./
RUN npm install
COPY ./client .
RUN npm run build

WORKDIR /admin
COPY ./admin/package.json ./
RUN npm install
COPY ./admin .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /client/dist /usr/share/nginx/html/client
COPY --from=builder /admin/dist /usr/share/nginx/html/admin
COPY default.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]