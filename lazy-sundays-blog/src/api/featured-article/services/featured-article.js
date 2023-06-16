'use strict';

/**
 * featured-article service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::featured-article.featured-article');
