"use strict";

/**
 * article controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::article.article", {
  //via https://forum.strapi.io/t/how-to-get-random-records-in-a-table-strapi-v4/23868/2
  async randomArticle(ctx) {
    const uid = "api::article.article";

    // Use the service to find published articles
    const allArticles = await strapi.entityService.findMany(uid, {
      publicationState: "live", // This ensures we only get published articles
      fields: ["documentId", "slug"],
    });

    if (allArticles.length === 0) {
      return ctx.notFound("No published articles found");
    }

    const randomIndex = Math.floor(Math.random() * allArticles.length);

    // Return the full article data, not just the slug
    const randomArticle = allArticles[randomIndex];

    return randomArticle;
  },
});
