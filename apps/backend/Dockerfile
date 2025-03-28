# use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
COPY apps/backend/package.json /temp/dev/apps/backend/
COPY packages/ /temp/dev/packages/
RUN cd /temp/dev && bun install

# copy node_modules from temp directory and project files
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Set up environment and prisma
WORKDIR /usr/src/app/apps/backend
RUN bunx prisma generate

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "dev" ]