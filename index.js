var StreamTransformer = require(__dirname + '/lib/stream_transformer.js');
var LineTransformer = require(__dirname + '/lib/line_transformer.js');
var Dictionary = require(__dirname + '/lib/dictionary.js');
var DictionaryLoader = require(__dirname + '/lib/dictionary_loader.js');

var parsePath = function(options) {
  if (options.path) {
    return options.path;
  }
  else {
    return (options.directory || __dirname + '/') + options.locale + (options.ext || '');
  }
};

var plugin = function (options) {
  var path, dict, lineTransformer;

  if (typeof options === 'string'){
    options = {path: options};
  }

  path = parsePath(options);

  dict = new Dictionary(
    (
      new DictionaryLoader(
        path
      )
    ).load().getLoaded(),
    options.keyPartSeparator,
    options.strictDictionary
  );

  if (options.defaultDictionary){
    if (typeof options.defaultDictionary === 'string'){
      options.defaultDictionary = {
        path: options.defaultDictionary
      };
    }

    options.defaultDictionary.path = parsePath(options.defaultDictionary);

    Dictionary.setDefault(new Dictionary(
      (
        new DictionaryLoader(
          options.defaultDictionary.path
        )
      ).load().getLoaded(),
      options.keyPartSeparator,
      true
    ));
  }

  lineTransformer = new LineTransformer({
    dict: dict,
    pattern: options.pattern,
    transformSeparator: options.transformSeparator,
    transform: options.transform
  });

  return new StreamTransformer(lineTransformer);
};

module.exports = plugin;
