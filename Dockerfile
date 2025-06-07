# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build NestJS app
RUN npm run build

# Expose port (adjust if your app uses a different one)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]
