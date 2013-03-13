var errors = require("./errors"),
    crypto = require("crypto"),
    idCounter = Math.round(Math.random() * 1000000);

//exports.normalizeId = normalizeId;
exports.bucketInRange = bucketInRange;
exports.generateBucket = generateBucket;
exports.generateHash = generateHash;

function generateBucket() {
    return idCounter++ % 100; //placeholder counter until we come up with a better id generation algorithm
}

function generateHash(content){
  var hash = crypto.createHash('md5');
  hash.update(new Buffer(content));
  return hash.digest('hex');
};

//function hash(str) {
//    var hash = 5381;
//    var bytes = new Buffer(str, 'ascii');
//
//    for (var i = 0; i < bytes.length; i++) {
//        hash = ((hash << 5) + hash) + bytes[i]; /* hash * 33 + c */
//    }
//    
//    return hash;
//}
//
///**
// * Returns the normalized integer version of the given `userId`.
// */
//function normalizeId(userId) {
//    var intId = NaN;
//    
//    if ('number' == typeof userId && !isNaN(userId)) {
//      intId = parseInt(userId, 10);
//    } else if ('string' == typeof userId) {
//      intId = hash(userId);
//    }
//
//    if (typeof intId != "number" || isNaN(intId)) {
//        throw new errors.InvalidUserIdError(userId);
//    }
//
//    return Math.abs(intId);
//}

/**
 * Returns `true` if the given `bucket` is contained in the given range,
 * inclusive.
 *
 *     bucketInRange(1, 0, 1) => true
 *     bucketInRange(1, 1, 1) => true
 *     bucketInRange(1, 0, 5) => true
 */
function bucketInRange(bucket, lowerBound, upperBound) {
    lowerBound = Math.max(lowerBound, 0) || 0;
    upperBound = Math.min(upperBound, 99) || 99;

    var mod = bucket % 100;
    var inRange = mod >= lowerBound && mod <= upperBound;

    return inRange;
}
