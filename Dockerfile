# Build docker image of react app
FROM node:16.17.1-alpine3.16 as build
# set working directory
RUN mkdir /app

WORKDIR /usr/app
# copy all files from directory to docker
COPY . ./
# install and chache app dependencies
RUN npm install

# set environment variables
ARG REACT_APP_Theme
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=https://pruebas.firmaseguro.co/api/v1
ENV REACT_APP_Theme=FirmaSeguro

RUN npm run build

# copy the react app build above in nginx
FROM nginx:alpine
# set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
RUN apk update && apk add bash
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=build /usr/app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
# expose port 80 and 443
EXPOSE 80
EXPOSE 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]
