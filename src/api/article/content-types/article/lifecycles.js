'use strict';

const PERCENT_MDX_SYNTAX = 0;
const BYTES_PER_WORD = 7; //6 chars per word, 1 char per space, asuming 1 byte per character
const WORDS_PER_MIN = 220; //lower end of adult silent reading range

/**
 * 
 * @param fileSize The size of the file in kilobytes.
 * @returns The estimated time it would take to read through the article. In minutes, to two decimal places.
 */
function calculateReadTime(fileSize){
  return ((((fileSize * 1024) * (1 - PERCENT_MDX_SYNTAX)) / BYTES_PER_WORD) / WORDS_PER_MIN).toFixed(2);
}

async function updateReadTime(event){
  const { result, params } = event; 
  
    if (result.body != undefined)
    {
      //calculate and store time it takes to read
      const entry = await strapi.entityService.update('api::article.article', result.id, {
        data: { 
          readTime: calculateReadTime(result.body.size)
        },
      });
    }
}

module.exports = {
  
    afterCreate(event) {

      updateReadTime(event);

    },

    afterUpdate(event) {
      
      updateReadTime(event);
    },
};
