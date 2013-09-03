var testCase = require('nodeunit').testCase;
var mongoose = require('../lib/mongoose');
var logger = require('../lib/logging').logger;
var userTests = require('./user');
var forumTests = require('./forum');
var threadTests = require('./thread');
var postTests = require('./post');

exports.setUp = function(done){
    done();
};
exports.tearDown = function(done){
//    mongoose.disconnect(function(err){
//        if(err) {
//            logger.error(err);
//            return;
//        }
//        logger.info('mongoose is disconnected');
//    });
    done();
};
exports.userTests = testCase(userTests);
exports.forumTests = testCase(forumTests);
exports.threadTests = testCase(threadTests);
exports.postTests = testCase(postTests);


