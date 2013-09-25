define(['Spa', 'jQuery', 'Underscore'], function(spa, $, _) {
    var BBS = spa.extend({
        routes: {
            "forum-:id": "forum",
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
            this.models['bbs'] = {
                forums: null,
                threads: null
            };

            /*
             *  Define ForumList and add it to its parent model (bbs)
             *  which is just a model hashmap
             */
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

            /*
             *  Define ThreadList and add it to its parent model (bbs)
             *  which is just a model hashmap
             */
            var threadList = new ThreadList({});
            this.models['bbs'].threads = threadList;

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
                me.ensureBbsMainView('bbs').show().toForumList();
            };
            this.ensureModelFetched('bbs', 'forums', showView);
        },
        forum: function(id){
            this.switchView('bbs');
            var me = this;
            var model = this.models['bbs'].threads;
            model.fetch({
                data: {forumId: id},
                success: function(o){
                    model.fetched = true;
                    me.ensureBbsForumView().doRender();
                    me.ensureBbsMainView('bbs').toThreadList();
                    $('#forumID').val(id);
                },
                error: function(o){
                    console.error('failure: '+o);
                }
            });
        },
        ensureBbsForumView: function(){
            var bbsMainView = this.ensureBbsMainView('bbs');
            var view = bbsMainView.threadListView;
            if(!view){
                var model = this.models['bbs'].threads;
                view = new ThreadListView({spa: this, model: model, modelDriven: true});
                bbsMainView.threadListView = view;
            }
            return view;
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
                me.ensureBbsMainView('bbs').show().toForumList();
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
        ensureBbsMainView: function(viewName){
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

            this.threadListView = new ThreadListView({
                vid: 'bbs-threads',
                spa: this.spa,
                prerendered: true,
                model: this.model.threads
            });
            this.addChild(this.threadListView);
        },
        afterRender: function(){
        },
        afterRenderChildren: function(){
        },
        switchView: function(view){
            _.each(this.children, function(v, id){
                v.hide();
            });
//            alert(view.model.fetched);
            view.doRender();
            view.show();
        },
        toForumList: function(){
            this.switchView(this.forumListView);
        },
        toThreadList: function(){
            this.switchView(this.threadListView);
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
            'name': 'unknown',
            'desc': 'unknown'
        },
        validate :function(data){
            if(data.name==''){
                $('#forumName').addClass('error');
                $('#nameError').html('论坛名称不能为空！');
                return '论坛名称为空';
            };
            if(data.desc==''){
                $('#forumDesc').addClass('error');
                $('#descError').html('论坛描述不能为空！');
                return '论坛描述为空';
            };
            return false;
        }
    });

    var ForumList = spa.Collection.extend({
        model: Forum ,
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
            'mouseup #updateForumBtn': 'clickUpdateForum',
            'mouseup #closeAddForumBtn': 'clickCloseAddForum',
            'mouseup #closemodifyForumBtn': 'clickCloseModifyForum',
            'mouseup .oper-del': 'clickDelForum',
            'mouseup .oper-mod': 'clickModForum',
            'focus #name': 'focusOnForumName',
            'focus #desc': 'focusOnForumDesc',
            'blur #name': 'blurForumName',
            'blur #desc': 'blurForumDesc'
        },
        configure :function(){
            var me = this;
            this.listenTo(this.model,'add',function(model, res, options){
                me.doRender();
            }),
            this.listenTo(this.model,'destroy',function(model, res, options){
                me.doRender();
            }),
            this.listenTo(this.model,'change',function(model, res, options){
                me.doRender();
            })
        },
        blurForumName:function(e){
            if(this.$el.find(e.target).val().trim()==''){
                this.$el.find('#forumName').addClass('error');
                this.$el.find('#nameError').html('论坛名称不能为空！');
            };
        },
        blurForumDesc:function(e){
            if(this.$el.find(e.target).val().trim()==''){
                this.$el.find('#forumDesc').addClass('error');
                this.$el.find('#descError').html('论坛描述不能为空！');
            };
        },
        focusOnForumName:function(e){
            this.$el.find('#forumName').removeClass('error');
            this.$el.find('#nameError').html(null);
        },
        focusOnForumDesc:function(e){
            this.$el.find('#forumDesc').removeClass('error');
            this.$el.find('#descError').html(null);
        },
        clickDelForum:function(e){
            var id = this.$el.find(e.target).prop('name');
            var delModel = this.model.get(id);
            if(confirm('确认删除？')){
                delModel.destroy();
                this.model.remove(delModel);
            }
        },
        clickAddForum: function(e){
            var btn = this.$el.find('#addForumBtn');
            if(btn.prop('disabled')){
                btn.prop('disabled', false);
            }
            else{
                var panel = this.$el.find('#addForumPanel');
                panel.show();
                btn.prop('disabled', true);
            }
        },
        clickSaveForum: function(e){
            var new_name = this.$el.find('#name').val();
            var new_desc = this.$el.find('#desc').val();
            var newforum = new Forum({name: new_name,desc: new_desc});
            var me = this;
            newforum.save({}, {
                success: function (model) {
                    console.log("save forum successfully.");
                    console.log(JSON.stringify(me.model));
                    me.model.add(model);
                    me.$el.find('#addForumBtn').prop('disabled', false);
                    var panel = me.$el.find('#addForumPanel');
                    panel.hide();
                },
                error : function(){
                    console.log('Fail to save forum ');
                }
            });
        },
        clickCloseAddForum: function(e){
            this.$el.find('#addForumBtn').prop('disabled', false);
            var panel = $('#addForumPanel');
            panel.hide();
        },
        clickUpdateForum: function(e){
            var update_name = this.$el.find('#name_mod').val();
            var update_desc = this.$el.find('#desc_mod').val();
            var _id = this.$el.find('#forum_id').val();
            var updateModel = this.model.get(_id);
            updateModel.set('name', update_name);
            updateModel.set('desc', update_desc);
            var me  = this;
            updateModel.save({},{
                success: function (model) {
                    console.log("update forum successfully.");
                    me.$el.find('#updateForumBtn').prop('disabled', false);
                    var panel = me.$el.find('#modifyForumPanel');
                    panel.hide();
                },
                error : function(){
                    console.log('Fail to update forum ');
                }
            });
        },
        clickModForum:function(e){
            var offset = this.$el.find(e.target).offset();
            this.$el.find('#modifyForumPanel').show();
            this.$el.find('#modifyForumPanel').css("position","absolute");
            this.$el.find('#modifyForumPanel').css("top",offset.top - 15);
            this.$el.find('#modifyForumPanel').css("left",offset.left + 45);
            var id = this.$el.find(e.target).attr('name');
            var oldModel = this.model.get(id);
            this.$el.find('#name_mod').val(oldModel.get('name'));
            this.$el.find('#desc_mod').val(oldModel.get('desc'));
            this.$el.find('#forum_id').val(id);
        },
        clickCloseModifyForum: function(e){
            this.$el.find('#updateForumBtn').prop('disabled', false);
            var panel = this.$el.find('#modifyForumPanel');
            panel.hide();
        }
    });

    var Thread = spa.Model.extend({
        idAttribute: '_id',
        urlRoot: '/thread',
        defaults: {
        },
        validate :function(data){
            return false;
        }
    });

    var ThreadList = spa.Collection.extend({
        model: Thread ,
        url: '/threads'
    });

    var Post = spa.Model.extend({
        idAttribute: '_id',
        urlRoot: '/post',
        defaults: {
        },
        validate :function(data){
            return false;
        }
    });

    var ThreadListView = spa.View.extend({
        templateName: 'bbs-threads',
        events: {
            'mouseup #addThreadBtn': 'clickAddThread',
            'mouseup #closeThreadbtn': 'clickCloseThread',
            'mouseup #saveThreadBtn': 'saveThread',
            'mouseup .oper-del': 'delThread'
        },
        configure :function(){
            var me = this;
            this.listenTo(this.model,'add',function(model, res, options){
                me.doRender();
            }),
            this.listenTo(this.model,'destroy',function(model, res, options){
                me.doRender();
            }),
            this.listenTo(this.model,'change',function(model, res, options){
                me.doRender();
             })
        },
        clickAddThread: function(){
            this.$el.find("#addTreadPanel").show();

        },
        clickCloseThread: function(){
            this.$el.find("#addTreadPanel").hide();
        },
        saveThread: function(){
            var threadTitle = this.$el.find('#title').val();
            var postContent = this.$el.find('#content').val();
            var originPost = new Post({content: postContent});
            var thread = new Thread({title: threadTitle, op: originPost});
            var me = this;
            thread.save({}, {
                success: function (model) {
                    console.log("save thread successfully.");
//                    console.log(JSON.stringify(me.model));
                    me.model.add(model);
                    me.$el.find("#addTreadPanel").hide();
                },
                error : function(){
                    console.log('Fail to save thread ');

                }
            });
        },
        delThread: function(e){
            var id = this.$el.find(e.target).prop('id');
            var crtBy = this.$el.find(e.target).prop('name');
            var delModel = this.model.get(id);
            var ownedPosts = delModel.get('posts');
            if(ownedPosts==""){
                if(confirm('确认删除？')){
                delModel.destroy();
                this.model.remove(delModel);
               }
            }else{
                alert("该Thread有posts,不能删除！");
            }
        }

    });
    return BBS;
});