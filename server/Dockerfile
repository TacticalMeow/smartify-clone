FROM node:16.13.2

# set working directory
WORKDIR /app

# copy shared packages
COPY shared ./shared
COPY server ./server

# install app dependencies
COPY package.json .

# RUN yarn install --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache
RUN yarn install
RUN yarn workspace @smarter/shared build

EXPOSE 8000

# start app
CMD ["yarn", "workspace", "@smarter/server","start"]