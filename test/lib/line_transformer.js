var LineTransformer = require('../../lib/line_transformer.js');
var expect = require('chai').expect;

describe('LineTransformer', function(){

  var transformer;

  var testString = 'qWes a deRdvd 13449gkj.-]\'";`zZ';

  var second = 'test trans forms';

  var dictionary = {
    translate: function(key){
      if (key === 'first') {
        return 'first_value';
      }
      else {
        return 'second_value';
      }
    }
  };

  LineTransformer.prototype.testTransform = function(content){
    return '123'+content.toUpperCase()+'23**'+content;
  };

  describe('#constructor()', function(){

    it('constructs instance of line transformer', function(done){
      transformer = new LineTransformer();
      expect(transformer).to.be.an.instanceof(LineTransformer);
      done();
    });

    it ('sets dictionary for transformer if specified', function(done){
      transformer = new LineTransformer({dict: dictionary});
      expect(transformer.dict).to.deep.equal(dictionary);
      done();
    });

    it('sets transform separator if specified', function(done){
      transformer = new LineTransformer({transformSeparator: '123'});
      expect(transformer.transformSeparator).to.be.equal('123');
      done();
    });

    it ('sets user transforms if specified', function(done){
      var userTransforms = {first: function(){}, second: function(){}};
      transformer = new LineTransformer({transform: userTransforms});
      expect(transformer.userTransform).to.be.equal(userTransforms);
      done();
    });

  });

  describe('#setDictionary()', function(){

    it ('sets dictionary for transformer', function(done){
      transformer = new LineTransformer();
      transformer.setDict(dictionary);
      expect(transformer.dict).to.deep.equal(dictionary);
      done();
    });

    it ('sets null if !!argument is false', function(done){
      transformer = new LineTransformer();
      transformer.setDict();
      expect(transformer.dict).to.be.equal(null);
      done();
    });

    it ('return object itself', function(done){
      transformer = new LineTransformer();
      expect(transformer.setDict()).to.be.equal(transformer);
      done();
    });

  });

  describe('#translate()', function(){

    it('throws if no dictionary', function(done){
      transformer = new LineTransformer();
      expect(transformer.translate.bind(transformer, 'first')).to.throw(Error);
      done();
    });

    it('translates word from dictionary', function(done){
      transformer = new LineTransformer({dict: dictionary});
      expect(transformer.translate('first')).to.be.equal('first_value');
      done();
    });

  });


  describe('#uppercase()', function() {

    it('uppercase some string', function (done) {
      expect(LineTransformer.prototype.uppercase(testString))
        .to.be.equal(testString.toUpperCase());
      done();
    });

  });

  describe('#lowercase()', function(){

    it('lowercase some string', function (done) {
      expect(LineTransformer.prototype.lowercase(testString))
        .to.be.equal(testString.toLowerCase());
      done();
    });

  });


  describe('#capitalize()', function(){

    it('capitalize some string', function (done) {
      expect(LineTransformer.prototype.capitalize(testString))
        .to.be.equal(testString.charAt(0).toUpperCase() + testString.slice(1).toLowerCase());
      done();
    });

  });


  describe('#capitalizeEvery()', function(){

    it('capitalize every word at some string', function (done) {
      expect(LineTransformer.prototype.capitalizeEvery(testString))
        .to.be.equal(testString.toLowerCase().replace(/\b(.)/g, function(s, res){
          return res.toUpperCase();
        }));
      done();
    });

  });


  describe('#reverse()', function(){

    it('reverse string', function(done){
      expect(LineTransformer.prototype.reverse(testString)).to.be.equal(
        testString.split('').reduceRight(function(res, s){
          return res + s;
        }, '')
      );
      done();
    });

  });

  describe('#transform()', function(){

    it('returns argument if no pattern in it',function(done){
      transformer = new LineTransformer();
      expect(transformer.transform(testString)).to.be.equal(testString);
      done();
    });

    it('returns transform argument if no pattern in it',function(done){
      transformer = new LineTransformer();
      transformer.translate = function(a){return a;};
      expect(transformer.transform(
        testString + '{{' + second + '| translate | testTransform }}'
      )).to.be.equal(testString+LineTransformer.prototype.testTransform(second));
      done();
    });

    it('returns transformed by user transform function', function(done){
      transformer = new LineTransformer();
      transformer.userTransform = {
        'translate': function(c){
          return '123';
        },
        'focused': function(c){
          return c+'$';
        }
      };
      expect(transformer.transform(testString + '{{' + second + '|translate|focused}}'+testString))
        .to.be.equal(
        testString + transformer.userTransform.focused(
          transformer.userTransform.translate(second)
        ) + testString
      );
      done();
    });

    it('throw error with unexpected transform', function(done){
      transformer = new LineTransformer();
      transformer.userTransform = {
        'translate': function(c){
          return '123';
        },
        'focused': function(c){
          return c+'$';
        }
      };
      expect(transformer.transform.bind(transformer, testString + '{{' + second + '|translate|focused|unexpected}}'+testString))
        .to.throw(Error);
      done();
    });
  });




});


