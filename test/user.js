var User = require('../source/models/User').model;
var mongoose = require('../lib/mongoose');
var logger = require('../lib/logging').logger;
var list = require('./mocks/users');

exports.testAddUser = function(test){
    var length = list.length;
    for(var i=0; i<length; i++){
        var item = list[i];
        logger.info( 'index ' + i + ' : ' +JSON.stringify(item) );
        var user = new User(item);
        user.save(function(err){
            if(err){
                logger.error('Fail to save user: '+err);
            }
            else{
                logger.info('succeed to save user ' + user.username);
            }
        });
    }
    test.done();
};
exports.testLoadUser = function(test){
    User.find({'_id': 0}, function(err, docs){
        if(err){
            logger.error('Fail to find: '+err);
            return;
        }
        test.equals(docs.length, 0);
        test.equals(docs[0].username, 'henryleu');
    });
    test.done();
};