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

# Stage 2: Create the final image with only the necessary build files
# FROM node:20

# WORKDIR /app

# # Enable Corepack in the final image
# RUN corepack enable

# # Install the correct version of Yarn in the final image
# RUN corepack prepare yarn@4.5.0 --activate

# # Copy only the built dist folder and the necessary files for the server
# COPY --from=builder /app/packages/travel-server/dist /app/dist
# COPY --from=builder /app/packages/travel-server/package.json /app/package.json
# COPY --from=builder /app/yarn.lock /app/yarn.lock
# COPY --from=builder /app/.yarn /app/.yarn
# COPY --from=builder /app/.yarnrc.yml /app/.yarnrc.yml


# Install only production dependencies
# RUN yarn workspaces focus --production
# RUN yarn install
# Expose port 3000 for your app
EXPOSE 3000

# Run the built application
CMD ["yarn", "workspace", "travel-server", "start"]
