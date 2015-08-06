var util = require('util');
var stream = require('stream');

function StreamTransformer(lineTransformer, options){
  stream.Transform.call(this, options);
  this.chunkTail = '';
  this.isBuffer = true;
  this.encoding = '';
  this.lineTransformer = lineTransformer;
  return this;
}

util.inherits(StreamTransformer, stream.Transform);

StreamTransformer.prototype.pushEnd = function(callback){
  var self = this;
  self.transformLine(this.chunkTail, function(err, transformed){
    if (err) {
      return callback(err);
    }
    if (self.isBuffer) {
      self.push(new Buffer(transformed, 'utf8'), self.encoding);
      return callback();
    }
    self.push(transformed, self.encoding);
    return callback();
  });
  this.chunkTail = '';
};

StreamTransformer.prototype._transform = function(chunk, encoding, callback){
  var lineArray;
  var self = this;
  var errors = [];

  //if chunk is Buffer - transform it to string
  if (encoding === 'buffer'){
    this.chunkTail += chunk.toString('utf8');
    this.isBuffer = true;
  }
  else {
    this.chunkTail += chunk;
    this.isBuffer = false;
  }

  this.encoding = encoding;

  //separate chunks by lines
  lineArray = this.chunkTail.split('\n');
  //last line is tail of text. Can be some string or ''. If ends by \0 - this is the end of file.
  this.chunkTail = lineArray.pop();

  lineArray.forEach(function(line){
    self.transformLine(line, function(err, transformed){
      if (err) {
        errors.push(err);
      }
      transformed += '\n';
      if (self.isBuffer) {
        return self.push(new Buffer(transformed, 'utf8'), encoding);
      }
      return self.push(transformed, encoding);
    });
  });

  if (errors.length){
    return callback(errors);
  }
  callback();
};

StreamTransformer.prototype._flush = function(callback){
  this.pushEnd(callback);
};

StreamTransformer.prototype.transformLine = function(line, callback){
    try {
      var res = this.lineTransformer.transform(line);
    }
    catch(e){
      e.message = 'gulp-transformer: ' + e.message;
      return callback(e);
    }
    callback(null, res);
};

module.exports = StreamTransformer;