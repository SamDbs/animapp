FROM node:14.15.5

WORKDIR /usr/src/api

COPY . .

RUN npm i -g typescript ts-node
RUN yarn

EXPOSE 8080
CMD [ "yarn", "dev" ]
