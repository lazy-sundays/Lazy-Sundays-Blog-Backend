"use strict";

/**
 * article controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::article.article", {
  //via https://forum.strapi.io/t/how-to-get-random-records-in-a-table-strapi-v4/23868/2
  async randomArticle(ctx) {
    const uid = "api::article.article";

    const allArticles = await strapi.entityService.findMany(uid, {
      filters: { publishedAt: { $notNull: true } },
      fields: ["slug"],
    });

    if (allArticles.length === 0) {
      return ctx.notFound("No published articles found");
    }

    const randomIndex = Math.floor(Math.random() * allArticles.length);

    return allArticles[randomIndex];
  },
});
