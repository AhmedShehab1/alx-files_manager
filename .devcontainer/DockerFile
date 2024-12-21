# Use a base image with Python and other development tools
FROM mcr.microsoft.com/devcontainers/python:3.10

# Install Redis and MongoDB
RUN apt-get update && \
    apt-get install -y redis-server mongodb && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Expose ports for Redis and MongoDB
EXPOSE 6379 27017

# Start Redis and MongoDB when the container starts
CMD service redis-server start && mongod --fork --logpath /var/log/mongodb.log && sleep infinity
