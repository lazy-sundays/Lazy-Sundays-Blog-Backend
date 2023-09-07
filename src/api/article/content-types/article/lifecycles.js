'use strict';

const { default: readTimeEstimate } = require('read-time-estimate');

async function updateReadTime(event){
  const { result, params } = event; 
  
    const uid = "api::article.article";
    const readTime = readTimeEstimate(result.body, 190, 12, 500, ['img', 'Image']).duration.toFixed(2)

    //update via knex so that the update lifecycle function isnt triggered repeatedly (forever)
    const rand = await strapi.db.connection
        .table(strapi.getModel(uid).collectionName)
        .update({
          read_time: readTime
        })
        .where('id', result.id)
}

module.exports = {
  
    afterCreate(event) {

      updateReadTime(event);

    },

    afterUpdate(event) {
      
      updateReadTime(event);
    },
};
