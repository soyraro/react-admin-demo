FROM node:8.1.2

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN npm install 

ENV PATH /usr/src/app/node_modules/.bin:$PATH

ADD . /usr/src/app
