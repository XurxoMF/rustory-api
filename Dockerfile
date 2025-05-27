FROM node:22

# Install innoextract
RUN apt-get update && \
    apt-get install -y innoextract && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

VOLUME ["/app"]

EXPOSE 3000

CMD ["npm", "run", "start"]
