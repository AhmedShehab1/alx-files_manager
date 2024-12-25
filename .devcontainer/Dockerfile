# Use the Node.js image from the devcontainer features
ARG VARIANT="20"
FROM mcr.microsoft.com/devcontainers/javascript-node:${VARIANT}

# Install app dependencies
WORKDIR /workspace
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port and define default command
EXPOSE 3000
CMD ["npm", "start"]
