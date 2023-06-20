'use strict';

/**
 * article router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;
const defaultRouter = createCoreRouter('api::article.article');

const customRouter = (innerRouter, extraRoutes = []) => {
    let routes;
    return {
      get prefix() {
        return innerRouter.prefix;
      },
      get routes() {
        if (!routes) routes = innerRouter.routes.concat(extraRoutes);
        return routes;
      },
    };
  };

const myExtraRoutes = [
    { // Path defined with a URL parameter
        method: 'GET',
        path: '/random-article',
        handler: 'article.randomArticle',
        config: {
            auth: false,
        },
    },
  ];

module.exports = customRouter(defaultRouter, myExtraRoutes);