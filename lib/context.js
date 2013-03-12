var utils = require("./utils");

module.exports = Context;

/**
 * The context for a given `userId` contains information about what kinds of
 * experiments are available to that user.
 */
function Context(bucket, userId, stamp) {
  this.bucket = bucket || utils.generateBucket();
  this.userId = userId;
  this.stamp = stamp;
}