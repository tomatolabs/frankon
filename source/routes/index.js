var logger = require('../../lib/logging').logger;
var util = require('../../lib/util');
var redis = require('../../lib/redis');
var Forum = require('../models/Forum').model;
var Thread = require('../models/Thread').model;
var Post = require('../models/Post').model;
var idGen = require('../../lib/id');

module.exports = function(app) {
    app.get('/', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/home', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/bbs', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/bbsm', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/bbs-forums', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/bbsm-forums', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/forum-:id', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        logger.debug('***********' + JSON.stringify(input));
        res.render('index', input);
    });

    app.delete('/forum/:id', function(req, res) {
        Forum.remove({'_id': req.params.id}, function(err) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            logger.debug('Deleted forum: ' + req.params.id);
            res.json(200, {'_id': req.params.id});
        })
    });
    app.get('/forums', function(req, res) {

        Forum.find().sort({'updOn': -1}).limit(100).exec(function(err, docs) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            logger.debug(JSON.stringify(docs));
            res.json(200, docs);
        })
    });

    app.post('/forum', function(req, res){
        var forum = JSON.parse(JSON.stringify(req.body));
        logger.debug('*****'+forum);
        var newforum = new Forum();
        newforum._id = idGen('Forum');
        newforum.desc = forum.desc;
        newforum.name = forum.name;
        newforum.crtBy = req.user.id;
        newforum.crtOn = Date.now();
        newforum.save(function(err, forum) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            logger.debug('Created forum: ' + forum._id);
            logger.debug(forum);
            res.json(200, forum);
        });

    });

    app.put('/forum/:id', function(req, res){
        var updateforum = JSON.parse(JSON.stringify(req.body));
//        logger.debug('*****'+JSON.stringify(forum));
//        logger.debug('*****' + updateforum._id);
        Forum.findOne({'_id': updateforum._id}, function(err, oldForum) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            oldForum.name = updateforum.name;
            oldForum.desc = updateforum.desc;
            logger.debug('*****'+JSON.stringify(oldForum));
            oldForum.save(function(err, forum){
                if (err) {
                    logger.error(err);
                    res.json(500, err);
                    return;
                }
                logger.debug('Updated forum: ' + forum._id);
                logger.debug(forum);
                res.json(200, forum);
            });
        });
    });

    app.get('/threads', function(req, res) {
        var id = req.query.forumId;
        Thread.find({forum: id}).sort({'updOn': -1}).limit(100).exec(function(err, docs) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            res.json(200, docs);
        })
        res.cookie('forumID', id);
    });
    app.delete('/thread/:id', function(req, res) {
        Thread.remove({'_id': req.params.id}, function(err) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            logger.debug('Deleted thread: ' + req.params.id);
            res.json(200, {'_id': req.params.id});
        })

    });
    app.post('/thread', function(req, res){
        var thread = JSON.parse(JSON.stringify(req.body));
        var originPost = new Post();
        originPost._id = idGen('Post');
        originPost.content = thread.op.content;
        originPost.save(function(err, post){
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }

            var newthread = new Thread();
            newthread._id = idGen('Thread');
            newthread.title = thread.title;
            newthread.forum = req.cookies.forumID;
            newthread.crtBy = req.user.id;
            newthread.crtOn = Date.now();
            newthread.op = post._id;
            newthread.crtBy = req.user.id;
            newthread.crtOn = Date.now();
            newthread.save(function(err, thread) {
                if (err) {
                    logger.error(err);
                    res.json(500, err);
                    return;
                }
                var forumID = thread.forum;
                Forum.update({'_id': forumID}, {'$push':{'threads': thread._id}}, function(err){
                    if(err){
                        logger.errror(err);
                        res.json(500, err);
                        return;
                    }
                    logger.debug('add thread from Forum: ' + thread._id);

                });
                logger.debug('Created thread: ' + thread._id);
                logger.debug(thread);
                res.json(200, thread);
            });
            logger.debug('Created origin post: ' + post._id);
        });
    });

//    app.post('/post', function(req, res){
//        var post = JSON.parse(JSON.stringify(req.body));
//        var newpost = new Post();
//        newpost._id = idGen('Post');
//        newpost.content = post.content;
//        newpost.save(function(err, post) {
//            if (err) {
//                logger.error(err);
//                res.json(500, err);
//                return;
//            }
//            logger.debug('Created post: ' + post._id);
//            logger.debug(post);
//            res.json(200, post);
//        });
//    });
};