# Welcome to the Rustory API repo

This is the official API used by Rustory to server game files, manage Rustory accounts...

To run this API just use this commands:

```sh
docker build -t rustory-api-docker .
```

```sh
docker run --name rustory-api -d -p <external-port>:3000 -v $(pwd):/app rustory-api-docker
```
