var plugin = require('../index.js');
var expect = require('chai').expect;
var s = require('stream');

describe('GulpLocaleTransform', function(){


  it('transforms if need', function(done){
    var pathToChunk = __dirname + '/_etc/to_translate';
    var pathToTransformed = __dirname + '/_etc/to_equal';
    var r = require('fs').createReadStream(pathToChunk, {encoding: 'utf8'});
    var output = new s.Writable();
    var data = '';
    output._write = function(chunk, en, callback){
      if (chunk instanceof Buffer){
        data += chunk.toString('utf8');
      }
      else {
        data += chunk;
      }
      callback();
    };


    r.on('open', function(){
      r.pipe(plugin({
        path:__dirname + '/_etc/dictionary/json.json'
      })).pipe(output);
    });

    output.on('finish', function(){
      expect(data).to.be.equal(require('fs').readFileSync(pathToTransformed, {encoding:'utf8'}));
      done();
    });
  });

  it('does not transforms if not need', function(done){
    var pathToChunk = __dirname + '/_etc/bigChunk';
    var pathToTransformed = __dirname + '/_etc/bigChunk';
    var r = require('fs').createReadStream(pathToChunk, {encoding: 'utf8'});
    var output = new s.Writable();
    var data = '';
    output._write = function(chunk, en, callback){
      if (chunk instanceof Buffer){
        data += chunk.toString('utf8');
      }
      else {
        data += chunk;
      }
      callback();
    };


    r.on('open', function(){
      r.pipe(plugin({
        path:__dirname + '/_etc/dictionary/json.json'
      })).pipe(output);
    });

    output.on('finish', function(){
      expect(data).to.be.equal(require('fs').readFileSync(pathToTransformed, {encoding:'utf8'}));
      done();
    });
  });

  it('works with string argument', function(done){
    var pathToChunk = __dirname + '/_etc/to_translate';
    var pathToTransformed = __dirname + '/_etc/to_equal';
    var r = require('fs').createReadStream(pathToChunk, {encoding: 'utf8'});
    var output = new s.Writable();
    var data = '';
    output._write = function(chunk, en, callback){
      if (chunk instanceof Buffer){
        data += chunk.toString('utf8');
      }
      else {
        data += chunk;
      }
      callback();
    };


    r.on('open', function(){
      r.pipe(
        plugin(__dirname + '/_etc/dictionary/json.json')
      ).pipe(output);
    });

    output.on('finish', function(){
      expect(data).to.be.equal(require('fs').readFileSync(pathToTransformed, {encoding:'utf8'}));
      done();
    });
  });

  it('can make path to dictionary from directory, ext and locale', function(done){
    var pathToChunk = __dirname + '/_etc/to_translate';
    var pathToTransformed = __dirname + '/_etc/to_equal';
    var r = require('fs').createReadStream(pathToChunk, {encoding: 'utf8'});
    var output = new s.Writable();
    var data = '';
    output._write = function(chunk, en, callback){
      if (chunk instanceof Buffer){
        data += chunk.toString('utf8');
      }
      else {
        data += chunk;
      }
      callback();
    };


    r.on('open', function(){
      r.pipe(
        plugin({
          directory: __dirname + '/_etc/dictionary/',
          locale: 'json',
          ext: '.json'
        })
      ).pipe(output);
    });

    output.on('finish', function(){
      expect(data).to.be.equal(require('fs').readFileSync(pathToTransformed, {encoding:'utf8'}));
      done();
    });
  });

  it('can make path to dictionary without directory and ext but with locale', function(done){
    var pathToChunk = __dirname + '/_etc/to_translate';
    var pathToTransformed = __dirname + '/_etc/to_equal';
    var r = require('fs').createReadStream(pathToChunk, {encoding: 'utf8'});
    var output = new s.Writable();
    var data = '';
    output._write = function(chunk, en, callback){
      if (chunk instanceof Buffer){
        data += chunk.toString('utf8');
      }
      else {
        data += chunk;
      }
      callback();
    };


    r.on('open', function(){
      r.pipe(
        plugin({
          locale: 'test/_etc/dictionary/json'
        })
      ).pipe(output);
    });

    output.on('finish', function(){
      expect(data).to.be.equal(require('fs').readFileSync(pathToTransformed, {encoding:'utf8'}));
      done();
    });
  });

  it('use default dictionary', function(done){
    var pathToChunk = __dirname + '/_etc/to_test_default';
    var pathToTransformed = __dirname + '/_etc/to_equal_default';
    var r = require('fs').createReadStream(pathToChunk, {encoding: 'utf8'});
    var output = new s.Writable();
    var data = '';
    output._write = function(chunk, en, callback){
      if (chunk instanceof Buffer){
        data += chunk.toString('utf8');
      }
      else {
        data += chunk;
      }
      callback();
    };


    r.on('open', function(){
      r.pipe(
        plugin({
          directory: __dirname + '/_etc/dictionary/',
          locale: 'json',
          ext: '.json',
          strictDictionary: false,
          defaultDictionary: {
            directory: __dirname + '/_etc/dictionary/',
            locale: 'default',
            ext: '.json'
          }
        })
      ).pipe(output);
    });

    output.on('finish', function(){
      expect(data).to.be.equal(require('fs').readFileSync(pathToTransformed, {encoding:'utf8'}));
      done();
    });
  });

  it('use default dictionary if it is string', function(done){
    var pathToChunk = __dirname + '/_etc/to_test_default';
    var pathToTransformed = __dirname + '/_etc/to_equal_default';
    var r = require('fs').createReadStream(pathToChunk, {encoding: 'utf8'});
    var output = new s.Writable();
    var data = '';
    output._write = function(chunk, en, callback){
      if (chunk instanceof Buffer){
        data += chunk.toString('utf8');
      }
      else {
        data += chunk;
      }
      callback();
    };


    r.on('open', function(){
      r.pipe(
        plugin({
          directory: __dirname + '/_etc/dictionary/',
          locale: 'json',
          ext: '.json',
          strictDictionary: false,
          defaultDictionary: __dirname + '/_etc/dictionary/default.json'
        })
      ).pipe(output);
    });

    output.on('finish', function(){
      expect(data).to.be.equal(require('fs').readFileSync(pathToTransformed, {encoding:'utf8'}));
      done();
    });
  });

});