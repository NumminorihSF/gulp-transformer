var fs = require('fs');
var yaml = require('yamljs');

function DictionaryLoader(path){
  this.path = path;
  this.loaded = null;

  return this;
}

DictionaryLoader.prototype.load = function(){
  this._loadJson(this.path);
  this._loadJson(this.path + '.json');
  this._loadYaml(this.path);
  this._loadYaml(this.path + '.yml');
  if (this.loaded === null) {
    throw new Error('Can not find file '+this.path);
  }
  return this;
};

DictionaryLoader.prototype._loadJson = function(path){
  if (this.loaded === null) {
    try {
      this.loaded = JSON.parse(fs.readFileSync(path, {encoding: 'utf8'}));
    }
    catch (e) {}
  }
  return this;
};

DictionaryLoader.prototype._loadYaml = function(path){
  if (this.loaded === null) {
    try {
      this.loaded = yaml.load(path);
    }
    catch(e){}
  }
  return this;
};

DictionaryLoader.prototype.getLoaded = function(){
  return this.loaded;
};

module.exports = DictionaryLoader;