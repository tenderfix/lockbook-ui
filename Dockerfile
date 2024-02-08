# Layer 1 - the build process

FROM node:16-alpine as build

ARG REACT_APP_ENVIRONMENT
ARG REACT_APP_API_URL
ARG REACT_APP_HUB_URL
ARG REACT_APP_DRAW_URL
ARG REACT_APP_DOCU_URL
ARG REACT_APP_GOOGLE_TAG_MANAGER_ID
ARG REACT_APP_USERCENTRICS_ID
ARG REACT_APP_SENTRY_DSN
ARG REACT_APP_SENTRY_ENVIRONMENT
ARG NPM_TOKEN
ARG REACT_APP_FACEBOOK_VERIFICATION

WORKDIR /usr/src/app

COPY package.json package-lock.json .nvmrc .npmrc ./

RUN nvm use

RUN npm ci

COPY . .

RUN npm run build

# Layer 2 - the production environment

FROM nginx:1-alpine as production

COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY .env ./.env

COPY ./ci/nginx.template.conf /etc/nginx/conf.d/

EXPOSE 80

CMD envsubst '$NGINX_HOST' \
    < /etc/nginx/conf.d/nginx.template.conf \
    > /etc/nginx/conf.d/default.conf \
    && cat /etc/nginx/conf.d/default.conf \
    && rm /etc/nginx/conf.d/nginx.template.conf \
    && exec nginx -g 'daemon off;'
