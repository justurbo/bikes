# Bike Reserv.io

The ultimate bike reservation app.


## Technologies

1. Frontend - [`React`](https://reactjs.org/), **TypeScript**
2. Backend - [`NestJS`](https://nestjs.com/), **TypeScript**

## Dependencies

1. Install Node [v16.13.1](https://nodejs.org/download/release/v16.13.1/).
2. Install [Docker](https://www.docker.com/).
3. We're using yarn instead of npm to manage packages:
> npm i -g yarn

## Setup

1. Start **PostgreSQL** database in root directory:
> docker compose up -d
2. Install frontend and backend dependencies
> yarn install
3. Start frontend and backend projects
> yarn start


## Credentials

If default manager account does not exist, then a default manager account will be created from `.env` file.

.env.development
> Email: manager@reserv.io\
> Password: a

## Code Quality

We use a few tools to enforce a common code styleguide and test our code.

### Tests

To test code run:
> yarn test


### Lint

To lint code with **Eslint**, run:
> yarn lint

### Formatting

Project uses **Prettier** for formatting code. Enable **Prettier** on your IDE.

To format code run:
> yarn pretty