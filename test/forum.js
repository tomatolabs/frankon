var mongoose = require('../lib/mongoose');
var Forum = require('../source/models/Forum').model;
var logger = require('../lib/logging').logger;
var list = require('./mocks/forums');

exports.testMaintainForum = function(test){
    var length = list.length;
    for(var i=0; i<length; i++){
        var item = list[i];
        Forum.findById(item._id, function(err, doc){
            if(err){
                logger.error('Fail to find document: '+err);
                return;
            }
            if(!doc){
                logger.info( 'index ' + i + ' : ' +JSON.stringify(item) );
                var instance = new Forum(item);
                instance.save(function(err){
                    if(err){
                        logger.error('Fail to save document: '+err);
                        return;
                    }
                    logger.debug('document is saved: '+raw);
                });
            }
            else{
                Forum.update({_id: item._id}, {name: 'forum updated'}, function(err, num, raw){
                    if(err){
                        logger.error('Fail to update document: '+err);
                        return;
                    }
                    logger.debug('document is updated: '+JSON.stringify(raw));
                });
            }
        });
    }

 /*   var forum1 = new Forum({_id: 1, name: "ffg", desc: "rrv"});
    forum1.save(function(err){
        console.log(JSON.stringify(forum1));

    });
 */
    test.done();
};
