'use strict';

const { default: readTimeEstimate } = require('read-time-estimate');

async function updateReadTime(event){
  const { result, params } = event;

  //calculate and store time it takes to read
  const entry = await strapi.entityService.update('api::article.article', result.id, {
    data: { 
      readTime: readTimeEstimate(result.body).duration.toFixed(2)
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