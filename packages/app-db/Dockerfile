# Use the official Node.js v20 image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

COPY packages/app-db/package.json /app

COPY ../../.yarn .yarn/
COPY ../../yarn.lock /app/yarn.lock
COPY ../../.yarnrc.yml /app/.yarnrc.yml

RUN corepack prepare yarn@4.5.0 --activate

# Install the dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the TypeScript files into JavaScript in the dist/ folder
RUN yarn workspace app-db build:dev

# # Run TypeORM migrations after building the project
CMD ["yarn", "migration:run"]
