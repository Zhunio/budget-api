## Description

Simple budget api

## Installation

```bash
$ npm install
```

## Environment Variables

```bash
# mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=mysql://root:password@localhost:3306/budget
PORT=3000
```

## Start database

```bash
$ npm run db:start
```

## Stop database

```bash
$ npm run db:stop
```

## Deploy migrations

```bash
$ npx prisma migrate deploy
```

## Generate client

```bash
$ npx prisma generate
```

## Create migration

```bash
$ npx prisma migrate dev --name {migration_name}
```

## Prototype migration

```bash
$ npx prisma db push
```

## Access phpMyAdmin

```bash
username=root
password=password
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Stop running app

```bash
$ npm run delete:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
