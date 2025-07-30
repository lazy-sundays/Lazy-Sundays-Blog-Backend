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

    // Use the new document service to count published articles
    const count = await strapi.documents("api::article.article").count({
      status: "published",
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
