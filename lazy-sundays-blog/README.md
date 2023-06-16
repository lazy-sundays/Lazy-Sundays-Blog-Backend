# Running the Backend

### `Setting Up MySQL`

Follow this [guide](https://dev.mysql.com/doc/refman/8.0/en/windows-installation.html) to install a local mysql instance.

During installtion, ensure to create a local user with full permissions.

After installtion, create a databse, making sure to keep it empty.

---

### `Setting Up Environment`

See this [guide](https://docs.strapi.io/dev-docs/migration/v4/migration-guide-4.0.6-to-4.1.8#setting-secrets-for-non-development-environments) for further details.

To ensure strapi functions correctly, you will need to set up the environment for it to run.
To do so, create a file in the root directory of the strapi project called `.env` with the following options.

```
HOST=0.0.0.0
PORT=1337
APP_KEYS={secret-1},{secret-2},{secret-3},{secret-4}
API_TOKEN_SALT={secret-5}
ADMIN_JWT_SECRET={secret-6}
TRANSFER_TOKEN_SALT={secret-7}

# Database
DATABASE_CLIENT=mysql
DATABASE_HOST={database-ip}
DATABASE_PORT={database-port}
DATABASE_NAME={database-name}
DATABASE_USERNAME={database-user-username}
DATABASE_PASSWORD={database-user-password}
DATABASE_SSL=false
JWT_SECRET={secret-8}
```

To generate `secret-1` through `secret-8` run the following command in a unix terminal:

&emsp;`openssl rand -base64 32 `

Next, enter all the inforation for the database that was created / gathered in the `Setting Up MySQL` step.

---

### `Staring Strapi`

After setting up the database and evironment, run the following command to install the necessary node modules:

&emsp;`npm install`

Afterwards, run strapi by running one of the following commands:


#### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
npm run develop
# or
yarn develop
```

#### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
npm run start
# or
yarn start
```

#### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
npm run build
# or
yarn build
```

