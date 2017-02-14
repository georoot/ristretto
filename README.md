[![Join the chat at https://gitter.im/ristretto-git/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ristretto-git/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Twitter URL](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&style=plastic)](https://github.com/georoot/ristretto)

# Ristretto

Ristretto is a very light-weight git server written in nodejs. After a night of
sleep deprivation and over caffination the initial version is released.
Current release has two components
1. Git server that manages requests over ssh
2. Simple api that currently support authentication and creating new user repo.

## Installation

Most of the parts about installation is pretty straight as you see in a node
project.

```
git clone https://github.com/georoot/ristretto.git
cd ristretto
npm install
```

Now both servers are written in separate files. Git server comes under `app.js`
and the api under `api.js`. You can run the both using

```
pm2 start app.js
pm2 start api.js
```

If you are developing the app, you can use

```
npm run devDaemon
npm run devApi
```

Which is configured with `nodemon` to autoreload the server on file change.

## Environment variables

> There are some environment variables that you do need to define

```
privateKey = { Location of your private key file, needed by ssh server}
             { EX : /home/user/.ssh/id_rsa}
GitBase    = { Where exactly do you want to store the repository}
             { EX : /home/user/git}
DbHost     = { mongodb host}
DbName     = { Name of database you want to use}
SaltRound  = { Used for password hashing, just set that to 10 ;) }
Secret     = { This is needed to generate token... Its a secret}
             { In linux you can generate using `xxd -l 20 -p /dev/urandom`}
HttpPort   = { The port where your api should run at}
GitPort    = { The port where your ssh server should run at}
```

## Documentation

Although you can generate documentation on you own using

```
npm run genDocs
```

But again i have [uploaded a version of the same over here](http://rahulbhola.ml/ristretto/docs/)

## User interface

Using api you can always create one, if you do create a very nice one, share
the repo link and i will merge that with codebase. I hate writing HTMl so this
probably takes the back of my seat.

## Docker support

It's in the pipeline once i get the codebase stable.

## Why not to use this ?

As i wrote above, most of the codebase is hack and currently lacks some very
important features.

## Why to use this ?

If you are a programer, which i pretty much believe you are because you are
looking at this site, you can `fork` the code and make PR to further this
project.

### My condition

I took me around 10 hours to get though this code-base and now i look more like

![Random dude with coffee mug](https://i.ytimg.com/vi/BFj2r7oKNaM/maxresdefault.jpg)

> Feel free to make PR ;) happy hacking !!
