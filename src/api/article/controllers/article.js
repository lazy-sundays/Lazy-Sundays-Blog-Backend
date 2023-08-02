'use strict';

/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', {
    //via https://forum.strapi.io/t/how-to-get-random-records-in-a-table-strapi-v4/23868/2
    async randomArticle(ctx){
        const uid = "api::article.article";

        const rand = await strapi.db.connection
            .select("slug")
            .from(strapi.getModel(uid).collectionName)
            .whereNot('published_at', null)
            // The random function of the DB. This one is Postgres.
            .orderByRaw("random()")
            .limit(1);
        
        return rand[0];
    }
});
