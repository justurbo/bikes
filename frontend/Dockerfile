#Build Stage Start

#Specify a base image
FROM node:alpine as builder

#Specify a working directory
WORKDIR '/app'

#Copy the dependencies file
COPY package.json .
COPY yarn.lock .

#Install dependencies
RUN yarn install

#Copy remaining files
COPY . .

#Build the project for production
RUN yarn build

#Run Stage Start
FROM nginx

#Copy production build files from builder phase to nginx
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80