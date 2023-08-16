'use strict';

const { default: readTimeEstimate } = require('read-time-estimate');

async function updateReadTime(event){
  const { result, params } = event; 
  
    const entry = await strapi.entityService.update('api::article.article', result.id, {
      data: {
        readTime: readTimeEstimate(string=result.body, customWordTime=190).duration.toFixed(2)
      },
    });
}

module.exports = {
  
    afterCreate(event) {

      updateReadTime(event);

    },

    afterUpdate(event) {
      
      updateReadTime(event);
    },
};
