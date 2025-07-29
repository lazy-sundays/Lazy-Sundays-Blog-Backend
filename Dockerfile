FROM node:22-alpine

# Installing libvips-dev for sharp Compatibility and netcat for database checks
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git curl netcat-openbsd
RUN npm install -g npm@11.5.1
RUN npm install -g node-gyp

# Set environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV STRAPI_TELEMETRY_DISABLED=true

WORKDIR /opt/
COPY package.json ./

# Clear npm cache and remove package-lock to avoid version conflicts
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install

ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
USER root

# Create uploads directory
RUN mkdir -p public/uploads

# Build the application for production
RUN npm run build

# Copy and set up the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 1337

# Use the entrypoint script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["npm", "run", "start"]
