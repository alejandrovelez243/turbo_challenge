FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Next.js needs this for hot reload in Docker
ENV WATCHPACK_POLLING=true

CMD ["npm", "run", "dev"]
