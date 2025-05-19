# Use official Node.js 22 image as the base
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript (if needed)
RUN npx tsc

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]
