# OIDC Service

## Description

This is the Luminu OIDC Service, it currently only supports the Implicit Flow, according to [https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth](https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth).
Implementation notes will most likely follow in the @luminu/core or @luminu/components repository.

## Side note

- requires NodeJS >= 11.6.0

## Setup

### Important Note

- sqldump not available due to privacy reasons

### Development

- import `./sqldump/development.sql.zip` into your local database (Only required once)
- Enter .env variables according to `./packages/service/.sample-env` and use NODE_ENV=DEV
- npm login --scope=@luminu --registry=http://repo.luminu.net/repository/luminu-node/
- npm install
- npm build:pre
- npm start

### Production

- import `./sqldump/production.sql.zip` into the production database (Only required once | If there are any errors, create the database `luminu_web` | This will only import the db structure)
- Enter .env variables according to `./packages/service/.sample-env` and use NODE_ENV=PROD
- npm login --scope=@luminu --registry=http://repo.luminu.net/repository/luminu-node/
- npm install
- npm build:pre
- npm build
- npm deploy
