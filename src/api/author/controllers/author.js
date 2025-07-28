"use strict";

/**
 * author controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::author.author", {
  async countArticles(ctx) {
    const count = await strapi.entityService.count("api::article.article", {
      filters: {
        authors: {
          slug: {
            $eqi: ctx.params.slug,
          },
        },
        publishedAt: {
          $notNull: true,
        },
      },
    });
    return { count: count };
  },
});
