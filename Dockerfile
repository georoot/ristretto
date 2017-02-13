FROM node:boron
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN apt-get -y install openssh-client
RUN ssh-keygen -q -t rsa -N '' -f /id_rsa
CMD [ "node","bin/ristretto.js"]
