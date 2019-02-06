FROM node:7.7.4

WORKDIR /opt/app
COPY . /opt/app

ENV PORT 3000
EXPOSE 3000

RUN npm uninstall --save bcrypt
RUN npm install --save bcrypt
RUN npm run prestart:prod

CMD [ "npm", "run", "start:prod" ]