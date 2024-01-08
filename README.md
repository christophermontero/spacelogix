# SpaceLogix

- [Project description](#project-description)
  - [Features](#features)
- [Requirements](#requirements)
- [User guide](#user-guide)
  - [Endpoints](#endpoints)
  - [MongoDB document schemas](#mongoDB-document-schemas)
- [Install guide](#install-guide)
  - [Containers](#containers)
- [Comments](#comments)
- [License](#license)
- [Author](#author)

## Project description

SpaceLogix is a cutting-edge logistics system that specializes in managing and optimizing space-related operations with the power of RESTful APIs.

### Features

For see full documentation, please visit [SpaceLogix API docs](https://documenter.getpostman.com/view/11299055/2s9YsJBXwZ#0ed4a3be-cb54-4443-8635-c7f799a4c1aa)

## Requirements

- Node.js version: 14.21.3
- NestJS version: 8.0.0
- Docker version: 24.0.7
- Docker compose version: 2.21.0
- Yarn version: 1.22.21

## User guide

### Endpoints

This API is composed for the following services:

#### Authorization

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/signin`
- `GET /api/v1/auth/signout`

#### User

- `GET /api/v1/users/me`

#### Product

- `POST /api/v1/products`
- `DELETE /api/v1/products/:productId`
- `PATCH /api/v1/products/:productId`
- `GET /api/v1/products`
- `GET /api/v1/products/:productId`

#### Order

- `POST /api/v1/orders`
- `GET /api/v1/orders/:orderId`
- `GET /api/v1/orders`
- `DELETE /api/v1/orders`

### MongoDB document schemas

#### User Schema

This object is a representation for product user:

```json
{
  "_id": "659b505abd8aa10100e284f1",
  "name": "Supplier1",
  "email": "supplier1@mailinator.com",
  "hashedPassword": "$2b$10$BhYoC1vLmOtxeBWgp3sULuJVgodI9SMyqH6tLwpSFrq5bEwCQZ/TO",
  "phone": "98765432",
  "address": "Fake St. 123",
  "city": "Supplier1 City",
  "country": "Supplier1 Country",
  "role": "supplier",
  "createdAt": "2024-01-08T01:31:06.148Z",
  "updatedAt": "2024-01-08T01:31:06.148Z",
  "__v": 0
}
```

#### Product schema

This object is a representation for product schema:

```json
{
  "_id": "659b50aabd8aa10100e284fa",
  "name": "Product 1",
  "description": "Description 1",
  "price": 1000,
  "currency": "usd",
  "stock": 100,
  "supplier": {
    "name": "Supplier1",
    "email": "supplier1@mailinator.com",
    "phone": "98765432",
    "address": "Fake St. 123",
    "city": "Supplier1 City",
    "country": "Supplier1 Country"
  },
  "createdAt": "2024-01-08T01:32:26.986Z",
  "updatedAt": "2024-01-08T01:32:26.986Z",
  "__v": 0
}
```

#### Order schema

This object is a representation of order schema:

```json
{
  "_id": "659b51a9bd8aa10100e28522",
  "products": ["659b50aabd8aa10100e284fa", "659b50e1bd8aa10100e28502"],
  "customer": {
    "name": "john doe",
    "email": "johndoe@mailinator.com",
    "phone": "98765432",
    "address": "fake st. 123",
    "city": "john doe city",
    "country": "john doe country"
  },
  "transporter": {
    "name": "transporter6",
    "email": "transporter6@mailinator.com",
    "phone": "98765432",
    "address": "fake st. 123",
    "city": "transporter6 city",
    "country": "transporter6 country"
  },
  "payment": {
    "paymentMethod": "credit",
    "cardNumber": "12345678",
    "expirationDate": "2025-12-31",
    "cvv": "123",
    "billingAddress": {
      "country": "billing country",
      "city": "billing city",
      "address": "fake st. 123",
      "zipCode": "billing zip code"
    },
    "totalAmount": 200,
    "currency": "cop"
  },
  "createdAt": "2024-01-08T01:36:41.939Z",
  "updatedAt": "2024-01-08T01:36:41.939Z",
  "__v": 0
}
```

## Install guide

Below are the instructions to install and run the project in development mode.

```bash
git clone https://github.com/christophermontero/spacelogix.git
cd spacelogix
```

Make sure you have MongoDB running before start the project in development mode.

```bash
yarn start:dev
```

### Containers

This project supports Docker. To use the API with containers, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your system.

2. Set the database connection in the app.module.ts file to: mongodb://mongodb:27017/spacelogixdb.

3. Run the following commands:

```bash
docker compose -f docker.compose.yml -f docker-compose.dev.yml up -d
```

And for production run the following:

```bash
docker compose -f docker.compose.yml -f docker-compose.prod.yml up -d
```

For stop the containers run the following:

```bash
docker compose -f docker.compose.yml -f docker-compose.dev.yml stop
```

And for destroy the services use the following command:

```bash
docker compose -f docker.compose.yml -f docker-compose.dev.yml down
```

## Comments

If you have any feedback, please reach out at cgortizm21@gmail.com

## License

This project is under [Apache License](https://www.apache.org/licenses/LICENSE-2.0).

## Author

- [@christophermontero](https://github.com/christophermontero)
