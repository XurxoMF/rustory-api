FROM oven/bun:latest

RUN dpkg --add-architecture i386

RUN apt-get update && apt-get install -y \
    wine \
    wine32:i386

ENV DISPLAY=:99
ENV WINEPREFIX=/root/.wine
ENV WINEDLLOVERRIDES="mscoree,mshtml="

WORKDIR /app

COPY . .

RUN chmod +x /app/libs/innounp.exe || echo "There is no innounp.exe on the libs folder!"

RUN bun install

EXPOSE 3000

VOLUME ["/app/db"]
VOLUME ["/app/public"]

CMD ["bun", "start"]
