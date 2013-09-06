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
    app.post('/forum', function(req, res) {
        var forumJson = JSON.parse(JSON.stringify(req.body));
        var forum = new Forum();
        forum._id = idGen('Forum');
        forum.name = forumJson.name;
        forum.desc = forumJson.desc;
        forum.save();
        logger.debug(forumJson);
    });
    app.get('/forums', function(req, res) {

        Forum.find().sort({'updOn': -1}).limit(5).exec(function(err, docs) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            res.json(200, docs);
        })
    });
};