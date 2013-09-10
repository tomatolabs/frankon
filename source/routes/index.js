var logger = require('../../lib/logging').logger;
var util = require('../../lib/util');
var redis = require('../../lib/redis');
var Forum = require('../models/Forum').model;
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

    app.delete('/forum/:id', function(req, res) {
        Forum.remove({'_id': req.params.id}, function(err) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            logger.debug('Deleted deal: ' + req.params.id);
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

};