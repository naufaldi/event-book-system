# use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
COPY apps/web/package.json /temp/dev/apps/web/
COPY packages/ /temp/dev/packages/
RUN cd /temp/dev && bun install

# copy node_modules from temp directory and project files
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Set work directory to frontend
WORKDIR /usr/src/app/apps/web

# run the app
USER bun
EXPOSE 5173/tcp

ENTRYPOINT [ "bun", "run", "dev", "--port", "5173" ]