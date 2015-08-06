var KEY_PART_SEPARATOR = '.';

var defaultDictionary;

function Dictionary(dictObject, keyPartSeparator, strict){
  this.$ = dictObject;
  this.strict = (typeof strict === 'undefined') ? true : !!strict;
  this.keyPartSeparator = keyPartSeparator || KEY_PART_SEPARATOR;
  return this;
}

Dictionary.prototype.translate = function(key){
  var keyPartsArray = key.split(this.keyPartSeparator);
  var result = Dictionary._translate(keyPartsArray, this);

  if (!result){
    if (this.strict) {
      throw new Error('Strict dictionary. No translation for this key ' +
        '('+ key + ')');
    }
    result = Dictionary._translate(keyPartsArray, defaultDictionary);
  }

  if (!result) {
    throw new Error('Non strict dictionary. No translation for this key ' +
      '('+ key + ')');
  }
  return result;
};

Dictionary._translate = function(keyPartsArray, dictionary){
  return keyPartsArray.reduce(function (dict, key) {
    if (!dict) return null;
    return dict[key];
  }, dictionary.$);
};

Dictionary.setDefault = function(dictionary){
  if (dictionary instanceof Dictionary){
    defaultDictionary = dictionary;
  }
  else {
    throw new Error('Need an instanceof Dictionary.');
  }
  return this;
};

module.exports = Dictionary;