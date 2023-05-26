FROM --platform=linux/amd64 node

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
RUN yarn install

# prisma global
RUN npm i -g prisma

# Exposes server main port
EXPOSE 3344

# Run server
ENTRYPOINT ["yarn", "start"]
