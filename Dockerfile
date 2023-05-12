FROM --platform=linux/amd64 node

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# COPY .env
COPY .env.docker.example .env

# Install app dependencies
RUN yarn install

