var DictionaryLoader = require('../../lib/dictionary_loader.js');
var expect = require('chai').expect;

describe('DictionaryLoader', function(){

  var paths = {
    json: __dirname + '/../_etc/dictionary/json.json',
    extJson: __dirname + '/../_etc/dictionary/json',
    yml: __dirname + '/../_etc/dictionary/yml.yml',
    extYml: __dirname + '/../_etc/dictionary/yml'
  };

  describe('#constructor()', function(){

    it('constructs instance of dictionary loader', function(done){
      var loader = new DictionaryLoader('path');
      expect(loader).to.be.an.instanceof(DictionaryLoader);
      done();
    });

  });

  describe('#load() ', function(){

    it ('does not throw when JSON file exist', function(done){
      var loader = new DictionaryLoader(paths.json);
      expect(loader.load.bind(loader)).to.not.throw(Error);
      done();
    });

    it ('does not throw when JSON file without extension exist', function(done){
      var loader = new DictionaryLoader(paths.extJson);
      expect(loader.load.bind(loader)).to.not.throw(Error);
      done();
    });

    it ('does not throw when YAML file exist', function(done){
      var loader = new DictionaryLoader(paths.yml);
      expect(loader.load.bind(loader)).to.not.throw(Error);
      done();
    });

    it ('does not throw when YAML file without extension exist', function(done){
      var loader = new DictionaryLoader(paths.extYml);
      expect(loader.load.bind(loader)).to.not.throw(Error);
      done();
    });

    it ('does throw when file does not exist', function(done){
      var loader = new DictionaryLoader('/path');
      expect(loader.load.bind(loader)).to.throw(Error);
      done();
    });

  });

  describe('#getLoaded()', function(){

    it('get dictionary from successfully loaded file ', function(done){
      var loader = new DictionaryLoader(paths.json);
      loader.loaded = {some: 'loaded'};
      expect(loader.getLoaded()).to.deep.equal({some: 'loaded'});
      done();
    });

  });

});


