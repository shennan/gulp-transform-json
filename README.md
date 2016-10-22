# gulp-transform-json

A gulp plugin to transform json on the fly using glob patterns; useful for validating and changing data before it is consumed by your application.

## install

```
$ npm i --save-dev gulp-transform-json
```

## use

The below example changes all `foo` keys in `object.json` to `baz`:

*object.json*
```json

{
  "foo": "bar",
  "bar": {
    "foo": "bar",
    "bar": {
      "foo": "bar"
    }
  }
}

```

*gulpfile.js*
```js
var gulp = require('gulp');
var transformJson = require('gulp-transform-json');

gulp.task('default', function () {

  return gulp
    .src('object.json')
    .pipe(transformJson('**/foo', function (val, path) {

      console.log('current value', val);
      console.log('current path', path);

      return 'baz'; // replace value with 'baz'

    }))
    .pipe(gulp.dest('mutated'));

})
```

You can also change the values asynchronously:

*gulpfile.js*
```js
var gulp = require('gulp');
var transformJson = require('gulp-transform-json');

gulp.task('default', function () {

  return gulp
    .src('object.json')
    .pipe(transformJson('**/foo', function (val, path, cb) {

      setTimeout(function () {

        cb('baz');

      }, 2000);

    }, {async: true}))
    .pipe(gulp.dest('mutated'));

})
```

## tests

```
$ npm test
```

## roadmap

- support streams
- allow multiple mutations in one traversal of the object
- write more varied glob tests