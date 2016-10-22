var through = require('through2');
var minimatch = require('minimatch');
var traverse = require('traverse');

module.exports = function (p, fn, opts) {

  // if no options object is passed, create one
  if (typeof opts != 'object')
    opts = {};

  // retain a variable for storing how many updates we should be expecting
  var updates = 0;

  // create a through stream
  return through.obj(function(file, enc, cb) {

    // retain a reference to this
    var self = this;

    // if a path is supplied
    if (typeof p == 'string') {

      // convert the Buffer to a plain object and instantiate with traverse
      var obj = traverse(JSON.parse(file.contents.toString()));

      // traverse the object
      obj.forEach(function (node) {

        // if the path matches a glob
        if (minimatch(this.path.join('/'), p, opts.minimatch)) {

          // if we are using a function to establish a value
          var isFunction = typeof fn == 'function';

          // if we are in async mode
          if (isFunction && opts.async) {

            // increment expected updates so we know how many updates to expect
            updates++;

            // retain a reference to the current node's update method
            var update = this.update;

            // call the function and pass a callback to update the record
            fn(node, this.path, function (val) {

              // update the record using the node's update method
              update(val);

              // decrement the updates variable so we know when we're finished
              updates--;

              // if there are no asynchronous updates then finish
              if (!updates)
                done();

            });

          } else {

            // if the fn passed is a function, update with return value
            if (isFunction)
              this.update(fn(node, this.path));
            // else update with actual value
            else
              this.update(fn);

          }
        }
      })

      // if there are no asynchronous updates then finish
      if (!updates)
        done();

    }

    function done () {

      // return the data to a Buffer
      file.contents = new Buffer(JSON.stringify(obj.value));

      // push file
      self.push(file);

      // we are done
      cb();

    }

  });
}