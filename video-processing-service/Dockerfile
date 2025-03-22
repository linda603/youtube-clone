# Stage 1: Build stage
# Use an official Node runtime as a parent image
FROM node:18 AS builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into working dir
COPY package*.json ./

#Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the docker image
COPY . .

# Build the app
RUN npm run build

#Step 2: Production stage
FROM node:18

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into working dir
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app from the builder stage
COPY --from=builder /app/dist ./dist

# make port 3000 available outside this container
EXPOSE 3000

# Define the command to run your app using CMD
CMD [ "npm", "run", "serve" ]