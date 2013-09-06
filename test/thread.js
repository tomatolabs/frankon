var mongoose = require('../lib/mongoose');
var Thread = require('../source/models/Thread').model;
var logger = require('../lib/logging').logger;
var list = require('./mocks/threads');

exports.testAddPost = function(test){
    var length = list.length;
    for(var i=0; i<length; i++){
        var item = list[i];
        logger.info( 'Thread-index ' + i + ' : ' +JSON.stringify(item) );
        var instance = new Thread(item);
        instance.save(function(err){
            if(err){
                logger.error('Fail to save thread: '+err);
                return;
            }
        });
    }
    test.done();
};