### `Setting Up Postgres`

Follow this [link](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) to install a local postgres instance.

During installation, ensure to create a local user with full permissions to your specified database.

After installation, create a database, making sure to keep it empty.

> Ubuntu Install Notes:
>
> > - [Creating a User and Database](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e)
> > - [Ensuring User has correct permissions](https://stackoverflow.com/a/74111630)

---

### `Setting Up The Environment`

To ensure strapi functions correctly, you will need to set up the environment for it to run.

See this [guide](https://docs.strapi.io/dev-docs/migration/v4/migration-guide-4.0.6-to-4.1.8#setting-secrets-for-non-development-environments) for further details.

#### `Local Development`

To do so, create a file in the root directory of the strapi project called `.env` with the following options.

```
#Strapi
HOST=0.0.0.0
PORT=1337
APP_KEYS={secret-1},{secret-2},{secret-3},{secret-4}
API_TOKEN_SALT={secret-5}
ADMIN_JWT_SECRET={secret-6}
TRANSFER_TOKEN_SALT={secret-7}
JWT_SECRET={secret-8}
STRAPI_WEBHOOK_SECRET={secret-9}
WEBHOOKS_POPULATE_RELATIONS=true
STRAPI_TELEMETRY_DISABLED=true

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST={database-ip}
DATABASE_PORT={database-port}
DATABASE_NAME={database-name}
DATABASE_USERNAME={database-user-username}
DATABASE_PASSWORD={database-user-password}
DATABASE_SSL={boolean}
```

To generate `secret-1` through `secret-8` you can run the following command in a unix terminal:

&emsp;`openssl rand -base64 32 `

Next, enter all the inforation for the database that was created / gathered in the `Setting Up Postgres` step. This should be the following information, replacing the placeholders:

```
DATABASE_HOST={database-ip}
DATABASE_PORT={database-port}
DATABASE_NAME={database-name}
DATABASE_USERNAME={database-user-username}
DATABASE_PASSWORD={database-user-password}
DATABASE_SSL={boolean}
```

#### `Production Development`

To generate the infromation, follow the same steps as above.

```
#Strapi
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS={secret-1},{secret-2},{secret-3},{secret-4}
API_TOKEN_SALT={secret-5}
ADMIN_JWT_SECRET={secret-6}
TRANSFER_TOKEN_SALT={secret-7}
JWT_SECRET={secret-8}
STRAPI_WEBHOOK_SECRET={secret-9}
STRAPI_TELEMETRY_DISABLED=true

DATABASE_CLIENT=postgres
DATABASE_HOST={database-ip}
DATABASE_PORT={database-port}
DATABASE_NAME={database-name}
DATABASE_USERNAME={database-user-username}
DATABASE_PASSWORD={database-user-password}
```

---

### `Starting Strapi`

After setting up the database and evironment, run the following command to install the necessary node modules:

```
npm install
```

Afterwards, run strapi in one of the following configurations:

### `Local Configuration`

#### `build`

Build the admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
npm run build
```

#### `develop`

Start your the application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
npm run develop
```

### `Production Configuration`

#### `build`

Build the admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
npm run build --production
```

#### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
ENV_PATH=./.env.production NODE_ENV=production npm run start
```
