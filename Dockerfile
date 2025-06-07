FROM oven/bun:latest

# Install innoextract
RUN apt-get update && \
    apt-get install -y innoextract && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3000

VOLUME ["/app/db"]
VOLUME ["/app/public"]

CMD ["bun", "start"]
