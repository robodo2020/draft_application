# use Node.js as base image
FROM node:alpine

# Create the work directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install --no-audit

# Copy remaining files to the container
COPY . /app


# Build typescript code (necessary step here?)
# RUN npm run build 

EXPOSE 8080

CMD ["npm", "run", "start"]
