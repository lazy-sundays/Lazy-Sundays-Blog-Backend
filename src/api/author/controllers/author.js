"use strict";

/**
 * author controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::author.author", {
  async countArticles(ctx) {
    const author = await strapi.db.query("api::author.author").findOne({
      where: {
        slug: {
          $eqi: ctx.params.slug,
        },
      },
    });

    if (!author) {
      return { count: 0 };
    }

    // Use the entityService to count published articles
    const count = await strapi.entityService.count("api::article.article", {
      publicationState: "live",
      filters: {
        authors: {
          id: {
            $eq: author.id,
          },
        },
      },
    });

    return { count: count };
  },
});
