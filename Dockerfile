FROM oven/bun:latest

# Build and install innoextract
RUN apt-get update && apt-get install -y \
    git \
    cmake \
    build-essential \
    libstdc++6 \
    gcc \
    libgcc-s1 \
    zlib1g \
    liblzma5 \
    libicu72 \
    libbz2-1.0 \
    libzstd1 \
    libboost-iostreams-dev \
    libboost-filesystem-dev \
    libboost-date-time-dev \
    libboost-system-dev \
    libboost-program-options-dev && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/XurxoMF/innoextract-reborn.git /tmp/innoextract-reborn && \
    mkdir /tmp/innoextract-reborn/build && \
    cd /tmp/innoextract-reborn/build && \
    cmake .. && \
    make && \
    make install && \
    cd / && rm -rf /tmp/innoextract-reborn

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3000

VOLUME ["/app/db"]
VOLUME ["/app/public"]

CMD ["bun", "start"]
