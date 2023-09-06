FROM node:latest as dev-runtime

WORKDIR /app
COPY . .

RUN npm install

ENTRYPOINT ["npm"]
CMD ["run", "dev"]
