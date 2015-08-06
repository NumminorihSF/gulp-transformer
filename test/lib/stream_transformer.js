var StreamTransformer = require('../../lib/stream_transformer.js');
var expect = require('chai').expect;
var s = require('stream');

describe('StreamTransformer', function(){

  var stream;
  var output;
  var pathToChunk = __dirname+'/../_etc/bigChunk';
  var data;
  var bigChunk = require('fs').readFileSync(pathToChunk, {encoding:'utf8'});

  var woTrans;

  var beforeEach = function(){
    woTrans = {
      transform: function (line) {
        return line;
      }
    };

    stream = new StreamTransformer(woTrans, {objectMode: true});
    output = new s.Writable();
    data = '';
    output._write = function(chunk, en, callback){
      if (chunk instanceof Buffer){
        data += chunk.toString('utf8');
      }
      else {
        data += chunk;
      }
      callback();
    };
  };

  describe('#constructor()', function(){

    it('constructs stream transformer', function(done){
      beforeEach();
      expect(stream).to.be.instanceOf(StreamTransformer);
      done();
    });

    it('sets line transformer', function(done){
      beforeEach();
      expect(stream.lineTransformer).to.deep.equal(woTrans);
      done();
    });

  });

  describe('#_transform()', function(){

    it('transform buffer steam correctly', function(done){
      beforeEach();
      var buffer = new Buffer(bigChunk, 'utf8');
      var current = [];
      stream.push = function(data){
        current.push(data);
      };
      stream._transform(buffer, 'buffer', function(err){
        stream._flush(function() {
          expect(err).to.not.exist;
          expect(Buffer.concat(current)).to.deep.equal(buffer);
          done();
        });
      });

    });

    it('works with string steam correctly', function(done){
      beforeEach();
      var utf8 = bigChunk;
      var current = '';
      stream.push = function(data){
        current += data;
      };
      stream._transform(utf8, 'utf8', function(err){
        stream._flush(function() {
          expect(err).to.not.exist;
          expect(current).to.be.equal(utf8);
          done();
        });
      });


    });

    it('works with file stream correctly', function(done){
      beforeEach();
      var buffer = new Buffer(bigChunk, 'utf8');
      var file = {
        contents: buffer,
        isNull: function(){}
      };
      var current = [];
      stream.push = function(data){
        current.push(data.contents);
      };
      stream._transform(file, 'utf8', function(err){
        stream._flush(function(err2) {
          expect(err).to.not.exist;
          expect(err2).to.not.exist;
          expect(Buffer.concat(current)).to.deep.equal(buffer);
          done();
        });
      });
    });

    it('works with null file stream correctly', function(done){
      beforeEach();
      var file = {
        contents: null,
        isNull: function(){return true;}
      };
      var current;
      stream.push = function(data){
        current = (data.contents);
      };
      stream._transform(file, 'utf8', function(err){
        stream._flush(function(err2) {
          expect(err).to.not.exist;
          expect(err2).to.not.exist;
          expect(current).to.be.equal(null);
          done();
        });
      });
    });

    it('works with error from transformLine function  as it should', function(done){
      beforeEach();
      var error = 'some error';
      stream.transformLine = function (t, callback){
        return callback(error);
      };
      stream.push = function(){};
      stream._transform(new Buffer(bigChunk, 'utf8'), 'buffer', function(err){
        expect(err[0]).to.be.equal(error);
        done();
      });
    });

  });

  describe('#transformLine()', function(){

    it('return error at callback if it is', function(done){
      beforeEach();
      stream.lineTransformer = null;
      stream.transformLine('', function(err){
        expect(err).to.exist;
        done();
      });
    });

  });

  describe('#_flush()', function(){

    it('works with error from transformLine function as it should', function(done){
      beforeEach();
      var error = 'some error';
      stream.transformLine = function (t, callback){
        return callback(error);
      };
      stream._flush(function(err){
        expect(err).to.be.equal(error);
        done();
      });
    });

  });

  it('can pipe to another stream', function(done){
    beforeEach();
    expect(stream.pipe.bind(stream, output)).to.not.throw(Error);
    done();
  });

  it('can be piped from another stream', function(done){
    beforeEach();
    var r = require('fs').createReadStream(pathToChunk, {encoding: 'utf8'});
    r.on('open', function(){
      expect(r.pipe.bind(r, stream)).to.not.throw(Error);
      done();
    });
  });

});