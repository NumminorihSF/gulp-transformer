var Dictionary = require('../../lib/dictionary.js');
var expect = require('chai').expect;

describe('Dictionary', function(){

  var dict = {
    first: 'some_value_Translated',
    inner: {
      second: 'anotherValue'
    }
  };

  var dDict, strict, nonStrict, separator;

  describe('#constructor()', function(){

    it('constructs strict dictionary', function(done){
      strict = new Dictionary(dict);
      dDict = new Dictionary({
        some: 'only default',
        recursive: {
          some: 'value'
        }
      });
      expect(strict).to.be.an.instanceof(Dictionary);
      done();
    });

    it('constructs non strict dictionary', function(done){
      nonStrict = new Dictionary(dict, null, false);
      done();
    });

    it('constructs dictionary with user key separator', function(done){
      separator = new Dictionary(dict, '/');
      done();
    });
  });

  describe('#setDefault() (static)', function(){

    it ('does not throw on Dictionary instance argument', function(done){
      expect(Dictionary.setDefault.bind(Dictionary, dDict)).to.not.throw(Error);
      done();
    });

    it ('throws on non Dictionary instance argument', function(done){
      expect(Dictionary.setDefault.bind(Dictionary, {})).to.throw(Error);
      done();
    });

  });

  describe('#translate()', function(){

    it('gets value from dictionary', function(done){
      expect(strict.translate('first')).to.be.equal('some_value_Translated');
      done();
    });

    it('gets value from non strict dictionary from default dictionary', function(done){
      expect(nonStrict.translate('some')).to.be.equal('only default');
      done();
    });

    it('gets value from dictionary with recursive key', function(done){
      expect(strict.translate('inner.second')).to.be.equal('anotherValue');
      done();
    });

    it('gets value from dictionary with user recursive key', function(done){
      expect(separator.translate('inner/second')).to.be.equal('anotherValue');
      done();
    });

    it('throws on get value from strict dictionary than is only at default dictionary', function(done){
      expect(strict.translate.bind(strict, 'some')).to.throw(Error);
      done();
    });

    it('throw on get value from non strict dictionary than is not anywhere', function(done){
      expect(nonStrict.translate.bind(nonStrict, 'unexpected')).to.throw(Error);
      done();
    });

    it('get from default dictionary recursive', function(done){
      expect(nonStrict.translate.bind(nonStrict, 'recursive.some')).to.not.throw(Error);
      done();
    });
  });

});



