var utils = require("./utils");

module.exports = function(groups) {
  function Group(name) {
      this.name = name;
      this.userIds = []; // array of user id's
      this.lowerBound = null;
      this.upperBound = null;
  }

  Group.prototype.__defineGetter__("name", function () {
      return this._name;
  });

  Group.prototype.__defineSetter__("name", function (name) {
      if (this._name) {
          delete groups[this._name];
      }

      this._name = name;

      // Store in the cache.
      groups[name] = this;
  });

  /**
   * Adds the user with the given `userId` to this group.
   */
  Group.prototype.addUser = function addUser(userId) {
      this.userIds.push(userId);
  };

  /**
   * Sets the lower and upper bounds for the percentage of users this group
   * contains. If `upperBound` is omitted, the `lowerBound` is used as the upper
   * bound and the lower bound is assumed to be 0.
   */
  Group.prototype.setPercentage = function setPercentage(lowerBound, upperBound) {
      if (typeof upperBound === "undefined") {
          upperBound = lowerBound;
          lowerBound = 0;
      }

      this.lowerBound = Math.max(parseInt(lowerBound, 10) || 0, 0);
      this.upperBound = Math.min(parseInt(upperBound, 10) || 100, 100);
  };

  /**
   * Returns `true` if this group contains the user with the given `userId` or the bucket is in the percentage range.
   */
  Group.prototype.contains = function contains(bucket, userId) {
      if (this.containsUser(userId)) return true;

      if (typeof this.lowerBound === "number" && typeof this.upperBound === "number") {
          return utils.bucketInRange(bucket, this.lowerBound, this.upperBound);
      }

      return false;
  };

  /**
   * Returns `true` if the user is in this group
   *
   * `user` can be a string (userId)
   * `user` can be an object. `id`, `name`, and `groups` properties are checked
   *
   * group.containsUser('userId');
   * group.containsUser({
   *   id: 'userId',
   *   name: 'User name',
   *   groups: [ 'group1', 'group2', group3' ]
   * });
   */
  Group.prototype.containsUser = function containsUser(user) {
      if (typeof user === "object") {
          if (user.id && this.containsUser(user.id)) return true;
          if (user.name && this.containsUser(user.name)) return true;
          if (user.groups) {
              for (var i=0, l=user.groups.length; i<l; i++) {
                  if (this.containsUser(user.groups[i])) return true;
              }
          }

      } else if (this.userIds.indexOf(user) !== -1) {
          return true;
      }

      return false;
  };

  /**
   * Gets the Group with the given `name`.
   */
  Group.byName = function byName(name) {
      return groups[name];
  };
  //
  ///**
  // * Returns an array of all Groups that contain the user with the given `userId`.
  // */
  //Group.forUser = function forUser(userId) {
  //    var result = [];
  //
  //    var group;
  //    for (var name in groups) {
  //        group = groups[name];
  //        if (group.contains(userId)) {
  //            result.push(group);
  //        }
  //    }
  //
  //    return result;
  //}


  return Group;
};
