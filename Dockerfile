FROM node:boron
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

RUN apt-get update

RUN apt-get -y install openssh-client
RUN ssh-keygen -q -t rsa -N '' -f /id_rsa

RUN apt-get -y install nginx
RUN rm /etc/nginx/sites-enabled/default
COPY config/nginx/default /etc/nginx/sites-enabled/
RUN service nginx start

EXPOSE 8090
EXPOSE 80
CMD [ "node","bin/ristretto.js"]
