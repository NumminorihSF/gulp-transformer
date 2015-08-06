var PATTERN = /\{{2}([\w\.\s\"\']+\s?\|\s?translate[\w\s\|]*)\}{2}/g;
var TRANSFOTM_SEPARATOR = '|';

function LineTransformer (options){
  options = options || {};

  this.dict = options.dict || null;
  this.pattern = options.pattern || PATTERN;
  this.transformSeparator = options.transformSeparator || TRANSFOTM_SEPARATOR;
  this.userTransform = options.transform || {};

  return this;
}


LineTransformer.prototype.transform = function(line){
  var self = this;

  return line.replace(this.pattern, function(s, stringToTransform){
    var transforms, value;

    transforms = stringToTransform.split(self.transformSeparator)
      .map(function(transform){
        return transform.trim();
      });

    value = transforms.shift();
    return transforms
      .reduce(function(res, transformName){
        if (typeof self.userTransform[transformName] === 'function'){
          res.push(self.userTransform[transformName].bind(self));
        }
        else if (typeof self[transformName] === 'function'){
          res.push(self[transformName].bind(self));
        }
        else {
          throw new Error('No such transform ('+transformName+') specified.');
        }
        return res;
      }, [])
      .reduce(function(res, transformation){
        return transformation(res);
      }, value);
  });
};

LineTransformer.prototype.setDict = function(dict){
  this.dict = dict || null;
  return this;
};

LineTransformer.prototype.translate = function(key){
  if (this.dict === null) {
    throw new Error('No dictionary to translate');
  }
  return this.dict.translate(key);
};

LineTransformer.prototype.uppercase = function(content) {
  return content.toUpperCase();
};

LineTransformer.prototype.lowercase = function(content) {
  return content.toLowerCase();
};

LineTransformer.prototype.capitalize = function(content){
  return content.charAt(0).toUpperCase() + content.substring(1).toLowerCase();
};

LineTransformer.prototype.capitalizeEvery = function(content){
  return this.capitalize(content).replace(/[\s\.\!`\'\"\,\?](\D)/g, function(s, res){
    return s.charAt(0) + res.toUpperCase();
  });
};

LineTransformer.prototype.reverse = function(content){
  return content.split('').reduceRight(function(res, letter){
    return res + letter;
  }, '')
};

module.exports = LineTransformer;
