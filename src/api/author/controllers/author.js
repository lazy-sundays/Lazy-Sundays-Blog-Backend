'use strict';

/**
 * author controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::author.author', {
    async countArticles(ctx){

        const [entries, count] = await strapi.db.query('api::article.article').findWithCount({
            where: { authors: {id:ctx.params.id}},
            populate: { authors: true },
        });
        return {"count": count};

    }
});
