require.config({
    baseUrl: './web/js',
    shim: {
        'jQuery': {
            exports: '$'
        },
        'Underscore': {
            exports: '_'
        },
        'Backbone': {
            deps: ['Underscore', 'jQuery'],
            exports: 'Backbone'
        },
        'Bootstrap': {
            deps: ['jQuery']
        },
        'jquery.ui.widget': {
            deps: ['jQuery']
        },
        'bootstrap-wysiwyg': {
            deps: ['jQuery', 'Bootstrap']
        },
        'jquery.hotkeys': {
            deps: ['jQuery']
        },
        'prettify': {
            deps: ['Bootstrap']
        },
        'Fileupload': {
            deps: ['jQuery', 'jquery.ui.widget']
        },
        'JST': {
            exports: 'JST'
        },
        'Util': {
            deps: ['jQuery']
        }
    },
    paths: {
        requireLib : '../../public/components/requirejs/require',
        jQuery: '../../public/components/jquery/jquery',
        Underscore: '../../public/components/underscore/underscore',
        'bootstrap-wysiwyg': '../../public/components/bootstrap-wysiwyg/bootstrap-wysiwyg',
        'jquery.hotkeys': '../../public/components/bootstrap-wysiwyg/external/jquery.hotkeys',
        prettify: '../../public/components/bootstrap-wysiwyg/external/google-code-prettify/prettify',
        Backbone: '../../public/components/backbone/backbone',
        Bootstrap: '../../public/components/bootstrap-tl/tl/js/bootstrap',
        'jquery.ui.widget':  '../../public/components/jquery-file-upload/js/vendor/jquery.ui.widget',
        Fileupload: '../../public/components/jquery-file-upload/js/jquery.fileupload',
        JST: '../../public/build/js/templates',
        Spa: 'backbone-spa',
        BBS: 'bbs',
        Util: 'util',
        App: 'app'
    },
    deps: ['App', 'Util'],
    callback: function(){
    },
    preserveLicenseComments: false
});