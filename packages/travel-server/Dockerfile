# Stage 1: Build the project
FROM node:20 as builder

WORKDIR /app

# Enable Corepack to manage Yarn versions and install the correct Yarn version
RUN corepack enable

# Copy the monorepo root's package.json and yarn.lock for workspaces resolution
COPY ../../package.json /app/package.json
COPY ../../.yarn .yarn/
COPY ../../yarn.lock /app/yarn.lock
COPY ../../.yarnrc.yml /app/.yarnrc.yml

# Install the correct version of Yarn (Yarn 4.x as defined in package.json)
RUN corepack prepare yarn@4.5.0 --activate

# Install all dependencies, including workspace dependencies
RUN yarn install

# Copy the rest of the travel-server source code to the builder stage
COPY . .

# Run the build for travel-server (this generates the dist folder)
RUN yarn workspace travel-server build:dev

# Expose port 8080 for your app
EXPOSE 8080

# Run the built application
CMD ["yarn", "workspace", "travel-server", "start"]
