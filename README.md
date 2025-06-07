# Welcome to the Rustory API repo

This is the official API used by Rustory to server game files, manage Rustory accounts...

## Generate the DB

Before starting the API you need to generate the DB migrations and apply them.

### Generate migrations

```sh
bun migration:generate
```

### Apply migrations

This will be executed when you start the container so you can skip it

```sh
bun migration:migrate
```

## Run the API

The API can be started for development and production.

### Development

```sh
docker build -f Dockerfile.dev -t rustory-api-docker-dev .
```

```sh
docker run --name rustory-api-dev -d -p 3000:3000 -v $(pwd)/db:/app/db -v $(pwd)/public:/app/public rustory-api-docker-dev
```

### Production

```sh
docker build -t rustory-api-docker .
```

```sh
docker run --name rustory-api -d -p 3005:3000 -v $(pwd)/db:/app/db -v $(pwd)/public:/app/public -v $(pwd)/src:/app/src rustory-api-docker
```
