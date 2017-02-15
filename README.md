# Raspwake

[![GitHub issues](https://img.shields.io/github/issues/kwiky/raspwake.svg)](https://github.com/kwiky/raspwake/issues)
[![Docker Hub](https://img.shields.io/badge/docker-ready-blue.svg)](https://registry.hub.docker.com/r/kwiky/raspwake)
[![Docker Automated buil](https://img.shields.io/docker/automated/kwiky/raspwake.svg)]()
[![GitHub release](https://img.shields.io/github/tag/kwiky/raspwake.svg)]()
 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is just a simple node script that grabs public and private ips addresses and send it to an email address.

## Environment variables

- `GMAIL_ADDRESS` : Gmail address used to connect to gmail SMTP server
- `GMAIL_PASSWORD` : Gmail password used to connect to gmail SMTP server
- `RECIPIENT` : Email address where you want to receive the start message.

## Usage

### Run with node
Install the dependencies
```
npm install
```
and run with environment variables
```
GMAIL_ADDRESS=[A_GMAIL_ADDRESS] \
GMAIL_PASSWORD=[A_GMAIL_PASSWORD] \
RECIPIENT=[YOUR_EMAIL_ADDRESS] node .
```

### Run with docker
Run online docker image with environment variables
```
docker run -e GMAIL_ADDRESS=[A_GMAIL_ADDRESS] \
-e GMAIL_PASSWORD=[A_GMAIL_PASSWORD] \
-e RECIPIENT=[YOUR_EMAIL_ADDRESS] kwiky/raspwake
```

or build docker image from sources
```
docker build -t raspwake .
```
and then run with environment variables
```
docker run -e GMAIL_ADDRESS=[A_GMAIL_ADDRESS] \
-e GMAIL_PASSWORD=[A_GMAIL_PASSWORD] \
-e RECIPIENT=[YOUR_EMAIL_ADDRESS] raspwake
```

## TODO
- Grab the docker host ip instead of container ip
- Improve documentation
- Improve source code
