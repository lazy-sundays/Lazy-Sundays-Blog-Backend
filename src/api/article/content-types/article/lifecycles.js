"use strict";

const { default: readTimeEstimate } = require("read-time-estimate");

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    if (data.body) {
      const readTime = readTimeEstimate(data.body, 190, 12, 500, [
        "img",
        "Image",
      ]).duration.toFixed(2);
      data.readTime = readTime;
    }
  },

  beforeUpdate(event) {
    const { data } = event.params;
    if (data.body) {
      const readTime = readTimeEstimate(data.body, 190, 12, 500, [
        "img",
        "Image",
      ]).duration.toFixed(2);

      console.log(readTime);
      data.readTime = readTime;
    }
  },
};
