FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY *.ts ./
COPY *.json ./
COPY *.js ./
RUN mkdir ./src
ADD src ./src/
COPY src ./src/

RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts

RUN npm install -g typescript
RUN --mount=type=ssh \
    npm install
# RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN npm run build

EXPOSE 4000
CMD [ "node", "./dist/main.js" ]
