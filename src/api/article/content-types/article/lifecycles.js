"use strict";

const { default: readTimeEstimate } = require("read-time-estimate");

async function updateReadTime(event) {
  const { result } = event;

  const uid = "api::article.article";
  const readTime = readTimeEstimate(result.body, 190, 12, 500, [
    "img",
    "Image",
  ]).duration.toFixed(2);

  await strapi.entityService.update(uid, result.id, {
    data: {
      read_time: readTime,
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
