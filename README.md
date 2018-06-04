# Payroll

This application is a playground for demonstrating your skills used in the recruitment process at MYOB.

# Prerequisites

The following applications are required for running and testing this project.

## NodeJS

Please ensure that you have a installed NodeJS version 5.8.0 or later.

## Docker

Please ensure that you have a installed Docker version 18.0 or later.

## Docker Compose

Please ensure that you have a installed Docker Compose version 1.21 or later.

# Tests

## Run Web Tests

```
docker-compose up -d
cd payroll_service/nodejs/app
npm install
npm run test-web
cd ../../..
docker-compose down
```

## Run API Tests

```
docker-compose up mongo -d
cd payroll_service/nodejs/app
npm install
npm run test-api
cd ../../..
docker-compose down
```
