var expect = require('expect');
var Vinyl = require('vinyl');
var transformJson = require('../');
var gulp = require('gulp');

describe('gulp-transform-object basic tests', function() {

  it ('should successfully parse file contents as an object', function () {

    var file = new Vinyl({
      contents: new Buffer('{"foo":"bar"}')
    });

    var plugin = transformJson();

    plugin.once('data', function(file) {

      var obj = JSON.parse(file.contents.toString());
      
      expect(obj).toMatch({
        foo: 'bar'
      });

    }).write(file);

  })

  it ('should pass the node and the path to the callback', function () {

    var file = new Vinyl({
      contents: new Buffer('{"foo":"bar"}')
    });

    var plugin = transformJson('foo', function (node, path) {

      expect(node).toEqual('bar');

      expect(path).toEqual(['foo']);

      return node;

    }).write(file);

  })

  it ('should update foo to baz', function () {

    var file = new Vinyl({
      contents: new Buffer('{"foo":"bar"}')
    });

    var plugin = transformJson('foo', function () {

      return 'baz';

    });

    plugin.once('data', function(file) {

      var obj = JSON.parse(file.contents.toString());
      
      expect(obj).toMatch({
        foo: 'baz'
      });

    }).write(file);

  })

  it ('should update foo to baz in async mode', function (done) {

    var file = new Vinyl({
      contents: new Buffer('{"foo":"bar"}')
    });

    var plugin = transformJson('foo', function (node, path, cb) {

      setTimeout(function () {
        
        cb('baz');

      }, 1000);

    }, {async: true});

    plugin.once('data', function(file) {

      var obj = JSON.parse(file.contents.toString());
      
      expect(obj).toMatch({
        foo: 'baz'
      });

      done();

    }).write(file);

  })

  it ('should update any key that matches glob **/foo', function () {

    var file = new Vinyl({
      contents: new Buffer(JSON.stringify({

        foo: 'bar',
        bar: {
          foo: 'bar'
        },
        baz: {
          bar: {
            foo: 'bar'
          }
        }
      }))
    });

    var plugin = transformJson('**/foo', function (node, path) {

      return 'baz';

    });

    plugin.once('data', function(file) {

      var obj = JSON.parse(file.contents.toString());
      
      expect(obj).toMatch({

        foo: 'baz',
        bar: {
          foo: 'baz'
        },
        baz: {
          bar: {
            foo: 'baz'
          }
        }
      });
    });

    plugin.write(file);

  })

  it ('should update any key that matches glob **/foo in async mode', function (done) {

    var file = new Vinyl({
      contents: new Buffer(JSON.stringify({

        foo: 'bar',
        bar: {
          foo: 'bar'
        },
        baz: {
          bar: {
            foo: 'bar'
          }
        }
      }))
    });

    var plugin = transformJson('**/foo', function (node, path, cb) {

      setTimeout(function () {
        
        cb('baz');

      }, 1000);

    }, {async: true});

    plugin.once('data', function(file) {

      var obj = JSON.parse(file.contents.toString());
      
      expect(obj).toMatch({

        foo: 'baz',
        bar: {
          foo: 'baz'
        },
        baz: {
          bar: {
            foo: 'baz'
          }
        }
      });

      done();

    }).write(file);

  })

});