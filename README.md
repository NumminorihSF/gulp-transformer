[![Coverage Status](https://coveralls.io/repos/NumminorihSF/gulp-transformer/badge.svg?branch=master&service=github)](https://coveralls.io/github/NumminorihSF/gulp-transformer?branch=master)

# Gulp Transformer

Make your files for many languages (locales) with it.
You can use YAML or JSON dictionaries format.
Also you can use it without translation.

## Usage

First, install `gulp-transformer` as a development dependency:

```sh
npm install --save-dev gulp-transformer
```

Then, add it to your `gulpfile.js`:

```js
var translate = require('gulp-transformer');

gulp.task('translate', function() {
  var langs = ['en', 'ru', 'de'];

  langs.forEach(function(lang){
    gulp.src('src/file/path')
      .pipe(transform(options))
      .pipe(gulp.dest('dest/file/path/' + lang));
  });
});
```

or better, handle errors:

```js
gulp.task('translate', function() {
  var langs = ['en', 'ru', 'de'];

  langs.forEach(function(lang){
    gulp.src('src/file/path')
      .pipe(
        translate(options)
        .on('error', console.error.bind(console, lang))
      )
      .pipe(gulp.dest('dest/file/path/' + lang));
  });
});
```

### Options

`options` in `translate` function can be:
  * `String` - Path to locale file.
  * `Object`:
    * `.path` - `String`. _Optional_. Path to locale file.
    Or you can use `.lang`, `.localeDirectory`.
    * `.locale` - `String`. _Optional_. Target language.
    * `.directory` - `String`. _Optional_. Directory with locale files. Default: `__dirname+'/'`.
    * `.ext` - `String`. _Optional_. Extension of file. Default: `''`.
    * `.pattern` - `RegExp`. _Optional_. Pattern to find strings to replace. You can specify your own pattern.
    To transform strings without translate.
    Default: `/\{{2}([\w\.\s\"\']+\s?\|\s?translate[\w\s\|]*)\}{2}/g`
    * `.transformSeparator` - `String`. _Optional_. Something to split parts of transform. Default: `'|'`.
    * `.transform` - `Object`. _Optional_. Every field is you transform function.
    First argument is an `content` to transform it.
    Function should return transformed string or `Error` object with some message.
    * `.keyPartSeparator` - `String`. _Optional_. Some symbol to separate key parts 
    (key like `a.b.c` has `'.'` as separator). Default: `'.'`.
    * `.strictDictionary` - `Boolean`. _Optional_. If it is `true` will not use default dictionary as fallback
    if can not find kay in this dictionary. To search some key in default - set it to `false`. Default: `true`.
    * `.defaultDictionary` - `Object`. _Optional_. Can be a `String` or an `Object`. 
    If `String` - it should Be path to default locale path. If `Object` contents fields like `options`:
      * `.path` - like `options.path`.
      * `.locale` - like `options.locale`.
      * `.directory` - like `options.directory`.
      * `.ext` - like `options.ext`.
    
    
If no `.path` specified, try construct it from `.directory + .locale + .ext`.

If you specify your own pattern:
  * create it with `g` flag (`/pattern/g`). Example we want to transform something between `'*~'` and `'~*'`.
   Then it should be like `/\*~\s?(\w\.\s?|\s?translate[\w\s\|]*)\s?~\*/g`. Also - you can remove translate. 
   But I doesn't know why do you want it.
  * make some string to check. To test it fast, check, 
  that `'some string were your *~word|translate~* <-pattern is'.match(pattern)` returns
  `[ 'word|translate' ]` without `'*~'` and `'~*'`.

**Be careful!** If you function is named like base transform, 
you will newer spawn this base transform function, and will use yours.

Specifying user transforms example:

```js
options = {
  path: 'some/path/to/locale',
  transform: {
    upperLowerRandom: function(string){
      string.split('').reduce(function(result, letter){
        result += Math.floor(Math.random()*2) ? letter.toUpperCase() : letter.toLowerCase();
        return result;
      }, '');
    }
  }
}
```



## How to use in files

By default it using angular-like syntax. Expressions in `{{}}` with ` | translate `
transformer will be translated.

Following examples assume that "some" in locales equals "My bIg StRing tO trAnsfOrm."

Example:

`'{{ some | translate }}'` transforms to "My bIg StRing tO trAnsfOrm."

You can use another base transforms. Or if you want - specify yours.

Base transforms are:
  * translate: `'{{ some | translate }}'` transforms to "My bIg StRing tO trAnsfOrm."
  * uppercase: `'{{ some | translate | uppercase }}'` transforms to "MY BIG STRING TO TRANSFORM."
  * lowercase: `'{{ some | translate | lowercase }}'` transforms to "my big string to transform."
  * capitalize: `'{{ some | translate | capitalize }}'` transforms to "My big string to transform."
  * capitalizeEvery: `'{{ some | translate | capitalizeEvery}}'` transforms to "My Big String To Transform."
  * reverse: `'{{ some | translate | reverse }}'` transforms to ".mrOfsnArt Ot gniRtS gIb yM"
  

## Test

Run tests
```sh
npm test
```

To check code coverage:
  * Install [istanbul](https://github.com/gotwarlost/istanbul) global
```sh
sudo npm install -h istanbul
```

  * Run npm script
```sh
npm run coverage
```
  
  * Look into `path/to/project/coverage/lcov-report/index.html`


## LICENSE - "MIT License"

Copyright (c) 2015 Konstantine Petryaev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.