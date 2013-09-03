var mongoose = require('../lib/mongoose');
var Post = require('../source/models/Post').model;
var logger = require('../lib/logging').logger;
var list = require('./mocks/posts');

exports.testAddPost = function(test){
    var length = list.length;
    for(var i=0; i<length; i++){
        var item = list[i];
        logger.info( 'index ' + i + ' : ' +JSON.stringify(item) );
        var instance = new Post(item);
        instance.save(function(err){
            if(err){
                logger.error('Fail to save document: '+err);
                return;
            }
        });
    }
    test.done();
};