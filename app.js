var express = require('express')
    , http = require('http')
    , path = require('path')
    , engine = require('ejs-locals')
    , settings = require('./settings')
    , security = require('./lib/security')
    , asseton = require('./lib/asseton');

var app = module.exports = express();

//some common configuration
app.enable('trust proxy');

// all environments
app.locals(settings.resources);
app.set('port', process.env.PORT || 3040);
app.set('views', __dirname + '/source/views');
app.set('view engine', 'ejs');
app.engine('ejs', engine);

var logging = require('./lib/logging');
var logger = logging.logger;
app.use(logging.applogger);
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(settings.secretKey));
app.use(require('./lib/session')(express)); //set session middle-ware

// routing
app.use(security); //security checking including auto-sign-up and authentication

var mode = app.get('env') || 'development';
if ('development' == mode) {
    app.use('/public', express.static(path.join(__dirname, 'public')));
    app.use('/web', express.static(path.join(__dirname, 'web')));
    app.use(asseton.development());
}
if ('production' == mode) {
    app.use(asseton.production());
}
require('./source/routes')(app);

/*
 *  Error Handling
 */
app.use(express.errorHandler()); //TODO: figure out what it really does when error hapens
app.use(function (err, req, res, next) { //Log errors
    logger.error(err.stack);
    next(err);
});
app.use(function (err, req, res, next) { //Handle XHR errors
    logger.error( err );
    if (req.xhr) {
        res.send(500,{error: 'TODO:真不好意思，程序出错了!'});
    } else {
        next(err);
    }
});
app.use(function (err, req, res, next) { //Handle XHR errors
    res.status(500);
    res.render('error');
});

http.createServer(app).listen(app.get('port'), '127.0.0.1', function(){
    logger.info('Favor server listening on port ' + app.get('port') + ' in ' + mode );
});
