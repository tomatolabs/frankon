define(['Spa', 'jQuery', 'Underscore'], function(spa, $, _) {
    var BBS = spa.extend({
        routes: {
            "bbs-forums": "bbsForums",
            "bbsm-forums": "bbsmForums",
            "*view(/:id)": "switchView", //   /bbs
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
            var forumTopList2 = new ForumList({});
            forumTopList2.fetch({
                success: function(o){
                    forumTopList2.fetched = true;
                },
                failure: function(o){
                    console.error('failure: '+o);
                }
            });
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
                    this[viewAction](viewAction, id);
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
            this.ensureTopView('bbs').show().toForumList();
        },
        bbsm: function(viewName){
            this.ensureTopView('bbsm').show().toForumList();
        },
        bbsForums: function(viewName){
            var me = this;
            var showView = function(){
                me.switchView('bbs');
                me.ensureTopView('bbs').show().toForumList();
            };
            this.ensureModelFetched('bbs', 'forums', showView);
/*
            var bbs = this.models['bbs'];
            if(bbs.forums.fetched){
                this.switchView('bbs');
                this.ensureTopView('bbs').show().toForumList();
            }
            else{
                var me = this;
                bbs.forums.fetch({
                    success: function(){
                        bbs.forums.fetched = true;
                        me.switchView('bbs');
                        me.ensureTopView('bbs').show().toForumList();
                    }
                });
            }
*/
        },
        bbsmForums: function(viewName){
            var me = this;
            var showView = function(){
                me.switchView('bbsm');
                me.ensureTopView('bbsm').show().toForumList();
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
        ensureTopView: function(viewName){
            var view = this.views[viewName];
            if(!view){
                view = new BbsView({spa: this, model:this.models[viewName], modelDriven: false});
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

    var BbsView = spa.View.extend({
        templateName: 'bbs-main',
        hidden: false,
        prerendered: true,
        events: {
            'mouseup [href="bbs-forums"]': 'toForumList'
        },
        configure: function(){
            this.forumListView = new ForumListView({
                vid: 'forum-list',
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

    var BbsmView = spa.View.extend({
        templateName: 'bbs-main',
        hidden: false,
        prerendered: true,
        events: {
            'mouseup [href="bbsm-forums"]': 'toForumList'
        },
        configure: function(){
            this.forumListView = new ForumListView({
                vid: 'forum-list',
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
            '_id': 0,
            'name': '',
            'desc': ''
        }
    });

    var ForumList = spa.Collection.extend({
        model: Forum,
        url: '/forums'
    });

    var ForumListView = spa.View.extend({
        templateName: 'forum-list'
    });
    return BBS;
});