FROM node:18-alpine

# Install dependencies for canvas
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Create directories for assets and temp files
RUN mkdir -p assets temp fonts

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3001

# Start the service
CMD ["npm", "start"]
