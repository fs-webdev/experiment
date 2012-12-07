var assert = require("assert"),
    vows = require("vows"),
    path = require("path");

vows.describe("multiInstance").addBatch({
  "configureTwoInstancesFromTwoFile": {
    "with valid config files": {
      topic: function () {
        var err,
            instance1 = require("./../lib"),
            instance2 = require("./../lib");

        try {
          instance1.configureFromFile(path.resolve(__dirname, "instance1.json"));
          instance2.configureFromFile(path.resolve(__dirname, "instance2.json"));
        } catch (e) {
          err = e;
        }

        var self = this;
        process.nextTick(function () {
          self.callback(err, instance1, instance2);
        });
      },
      "should succeed": function (err, instance1, instance2) {
        assert.ok(!err);
      },
      "should not overlap": function (err, instance1, instance2) {
        var exps1 = instance1.readFor(instance1.contextFor("", ""), {}),
            exps2 = instance2.readFor(instance2.contextFor("", ""), {});
        
        assert.ok(exps1.features.instance1Ex != undefined);
        assert.ok(exps1.features.instance2Ex == undefined);
        assert.ok(exps2.features.instance1Ex == undefined);
        assert.ok(exps2.features.instance2Ex != undefined);
      }
    }
  }
}).export(module);
