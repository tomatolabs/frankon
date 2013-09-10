define(['Spa', 'jQuery', 'Underscore'], function(spa, $, _) {
    var BBS = spa.extend({
        routes: {
            "bbs-forums": "bbsForums",
            "bbsm-forums": "bbsmForums",
            //"*view(/:id)": "switchView", //   /bbs
            "bbs": "bbs",
            "bbsm": "bbsm",
            "home": "home"
        },
        root: '/',
        defaultUri: 'home',
        configure: function(){
            this.models['bbs'] = {forums: null };
            var forumTopList = new ForumList({});
            forumTopList.fetch({
                success: function(o){
                    forumTopList.fetched = true;
                },
                failure: function(o){
                    console.error('failure: '+o);
                }
            });
            this.models['bbs'].forums = forumTopList;

            this.models['bbsm'] = {forums: null };
            this.models['bbsm'].forums = forumTopList;
            this.configureViews();
        },
        switchView: function(view, id){
            console.log(view + ' - ' + id);
            var viewName = '';
            var viewAction = null;
            if(this.routes[view]){
                viewName = view;
            }
            else if(view==null){
                viewName = this.defaultUri;
            }
            else{
                console.warn( "/"+view + '/'+(id?id:'' + ' is not valid URI') );
                //TODO: alert or redirect
            }

            if(viewName){
                console.log('viewName - ' + viewName);
                var viewAction = this.routes[viewName];
                if(viewName.indexOf('-')==-1){
                    //this[viewAction](viewAction, id);
                }
                $('li>a[set]').parent().removeClass('active');
                $('li>a[set="'+viewName+'"]').parent().addClass('active');
                $('.view').hide();
                $('[set="'+viewName+'"].view').show();
            }
        },
        home: function(viewName){
        },
        bbs: function(viewName){
            var me = this;
            var showView = function(){
                me.switchView('bbs');
                me.ensureBbsView('bbs').show().toForumList();
            };
            this.ensureModelFetched('bbs', 'forums', showView);
        },
        bbsm: function(viewName){
            var me = this;
            var showView = function(){
                me.switchView('bbsm');
                me.ensureBbsmView('bbsm').show().toForumList();
            };
            this.ensureModelFetched('bbsm', 'forums', showView);
        },
        bbsForums: function(viewName){
            var me = this;
            var showView = function(){
                me.switchView('bbs');
                me.ensureBbsView('bbs').show().toForumList();
            };
            this.ensureModelFetched('bbs', 'forums', showView);
        },
        bbsmForums: function(viewName){
            var me = this;
            var showView = function(){
                me.switchView('bbsm');
                me.ensureBbsmView('bbsm').show().toForumList();
            };
            this.ensureModelFetched('bbsm', 'forums', showView);
        },
        ensureModelFetched: function(module, model, cb){
            var mdl = this.models[module][model];
            if(mdl.fetched){
                cb();
            }
            else{
                var me = this;
                mdl.fetch({
                    success: function(){
                        mdl.fetched = true;
                        cb();
                    }
                });
            }
        },
        ensureBbsView: function(viewName){
            var view = this.views[viewName];
            if(!view){
                view = new BbsMainView({spa: this, model:this.models[viewName], modelDriven: false});
                this.views[viewName] = view;
                var content = '[set="'+viewName+'"].view';
                $(content).html( view.el );
            }
            return view;
        },
        ensureBbsmView: function(viewName){
            var view = this.views[viewName];
            if(!view){
                view = new BbsmMainView({spa: this, model:this.models[viewName], modelDriven: false});
                this.views[viewName] = view;
                var content = '[set="'+viewName+'"].view';
                $(content).html( view.el );
            }
            return view;
        },
        configureViews: function(){
            $('ul li.message a').mouseup(function(){
                var p = $(this).parent();
                if(p.hasClass('active')){
                    p.removeClass('active');
                }
                else{
                    p.addClass('active');
                }
            });
        }
    });

    var BbsMainView = spa.View.extend({
        templateName: 'bbs-main',
        hidden: false,
        prerendered: true,
        events: {
            'mouseup [href="bbs-forums"]': 'toForumList'
        },
        configure: function(){
            this.forumListView = new ForumListView({
                vid: 'bbs-forums',
                spa: this.spa,
                prerendered: true,
                model: this.model.forums
            });
            this.addChild(this.forumListView);
        },
        afterRender: function(){
        },
        afterRenderChildren: function(){
        },
        switchView: function(view){
            _.each(this.children, function(v, id){
                v.hide();
            });
            //alert(view.model.fetched);
            view.doRender();
            view.show();
        },
        toForumList: function(){
            this.switchView(this.forumListView);
        }
    });

    var BbsmMainView = spa.View.extend({
        templateName: 'bbsm-main',
        hidden: false,
        prerendered: true,
        events: {
            'mouseup [href="bbsm-forums"]': 'toForumList'
        },
        configure: function(){
            this.forumListView = new BbsmForumListView({
                vid: 'bbsm-forums',
                spa: this.spa,
                prerendered: true,
                model: this.model.forums
            });
            this.addChild(this.forumListView);
        },
        afterRender: function(){
        },
        afterRenderChildren: function(){
        },
        switchView: function(view){
            _.each(this.children, function(v, id){
                v.hide();
            });
            //alert(view.model.fetched);
            view.doRender();
            view.show();
        },
        toForumList: function(){
            this.switchView(this.forumListView);
        }
    });

    var Forum = spa.Model.extend({
        idAttribute: '_id',
        urlRoot: '/forum',
        defaults: {
            'name': '',
            'desc': ''
        },
        configure: function(){

        }
    });

    var ForumList = spa.Collection.extend({
        model: Forum,
        url: '/forums'
    });

    var ForumListView = spa.View.extend({
        templateName: 'bbs-forums'
    });

    var BbsmForumListView = spa.View.extend({

        templateName: 'bbsm-forums',
        events: {
            'mouseup #addForumBtn': 'clickAddForum',
            'mouseup #saveForumBtn': 'clickSaveForum',
            'mouseup #closeAddForumBtn': 'clickCloseAddForum'
        },
        configure: function() {
            var me = this;
            this.listenTo(this.model, 'add', function(model, collection, options){
               me.doRender();
            });
        },
        clickAddForum: function(e){
            var btn = $('#addForumBtn');
            if(btn.prop('disabled')){
                btn.prop('disabled', false);
            }
            else{
                var panel = $('#addForumPanel');
                panel.show();
                btn.prop('disabled', true);
            }
        },
        clickSaveForum: function(e){
            $('#addForumBtn').prop('disabled', false);
            var panel = $('#addForumPanel');
            panel.hide();
            var new_name = $('#name').val();
            var new_desc = $('#desc').val();
            var newforum = new Forum({name: new_name,desc: new_desc});
            var me = this;
            newforum.save({}, {
                success: function (model) {
                    console.log("save forum successful.");
                    me.model.add(model);
                },
                error: function (model, response) {
                    console.log("save forum failing.");
                    console.log(JSON.stringify(model));
                    console.log(response);
                }
            });
        },
        clickCloseAddForum: function(e){
            $('#addForumBtn').prop('disabled', false);
            var panel = $('#addForumPanel');
            panel.hide();
        }

    });

    return BBS;
});