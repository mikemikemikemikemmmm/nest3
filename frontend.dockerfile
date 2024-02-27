FROM node:lts-alpine as builder
WORKDIR /frontend_admin
COPY ./admin/package.json .
RUN npm install
COPY ./admin .
RUN npm run build

WORKDIR /frontend_client
COPY ./client/package.json .
RUN npm install
COPY ./client .
RUN npm run build

FROM nginx:stable-alpine
COPY default.conf /etc/nginx/conf.d/default.conf 
COPY --from=builder /frontend_client/dist /usr/share/nginx/html/client2
COPY --from=builder /frontend_admin/dist /usr/share/nginx/html/admin2
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]