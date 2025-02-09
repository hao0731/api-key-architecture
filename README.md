# API Key Architecture

This project implements the operation of API Keys in a microservices architecture. API authorization and authentication are handled through an API Gateway, allowing backend services to focus on their respective domains. Both the API Gateway and Backend For Frontend are implemented using [KrakenD](https://www.krakend.io/), while the backend services are built with [NestJS](https://nestjs.com/).

```mermaid
architecture-beta
    group services(cloud)[microservices]

    service todo(server)[Todo Service] in services
    service tododb(database)[Todo DB] in services
    service auth(server)[Auth Service] in services
    service authdb(database)[Auth DB] in services
    service apigateway(logos:aws-api-gateway)[API Gateway] in services
    service bff(logos:aws-api-gateway)[Backend For Frontend] in services

    junction apigatewayToTodo
    junction bffToTodo

    apigateway:B -- T:auth
    bff:T -- B:auth
    auth:L -- R:authdb
    todo:R -- L:tododb
    apigateway:R -- L:apigatewayToTodo
    apigatewayToTodo:B -- T:todo
    bff:R -- L:bffToTodo
    bffToTodo:T -- B:todo
```
