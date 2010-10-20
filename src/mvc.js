var mvc = (function() {
    
    return {
        
        create: function(context) {
            var instance = _.clone(mvc);
            instance.init(context);
        },
        
        init: function(context) {
            this.events.init();
            this.dependencies.init();
            
            this.models.init(this.events.dispatch, this.dependencies);
            this.views.init(this.events, this.dependencies);
            this.controllers.init(this.events, this.views, this.models, this.dependencies);
            
            this.controllers.register('start_up', context);
            this.events.dispatch('start_up');
        },
        
        events: (function() {

            var registered,
                contexts;

            return {

                init: function() {
                    contexts = registered = {};
                },

                listen: function(event, callback, context) {
                    if(!registered[event]) {
                        registered[event] = {
                            callbacks: [],
                            contexts: []
                        }
                    }

                    registered[event].callbacks.push(callback);
                    registered[event].contexts.push(context || this);
                },

                remove: function(event, callback) {
                    var callbacks = registered[event].callbacks,
                        position = _.indexOf(callbacks, callback);

                    if(position !== -1) {
                        callbacks.splice(position, 1);
                    }
                },

                removeAll: function(event) {
                    registered[event] = [];
                },

                dispatch: function(event, params) {
                    if(registered[event]) {
                        var callbacks = registered[event].callbacks,
                            contexts = registered[event].contexts;

                        if(callbacks) {
                            for(var i = 0, l = callbacks.length; i < l; i++) {
                                callbacks[i].apply(contexts[i], params);
                            }
                        }
                    }
                }

            }

        })(),
        
        models: (function() {
            
            var dispatch,
                dependencies;
            
            return {
                
                init: function(_dispatch, _dependencies) {
                    dispatch = _dispatch;
                    dependencies = _dependencies
                },
                
                register: function(name, model) {
                    model.dispatch = dispatch;
                    dependencies.register.singleton(name, model, model.dependencies);
                }
            }
            
        })(),
        
        views: (function() {
            
            var events,
                dependencies;

            return {
                init: function(_events, _dependencies) {
                    events = _events;
                    dependencies = _dependencies;
                },
                
                register: function(element, view) {
                    _.each(element, function(el) {
                        var view_instance = _.clone(view),
                            methods = _.functions(view_instance);

                        if(view_instance.dependencies) {
                            dependencies.inject(view_instance, view_instance.dependencies);
                        }
                        
                        _.each(methods, function(method) {
                            if(method !== 'init')
                              events.listen(method, view_instance[method], view_instance);
                        });

                        view_instance.element = el;
                        view_instance.events = events;

                        if(view_instance.init)
                          view_instance.init();
                    });
                }
            }
        })(),
        
        controllers: (function() {
            
            var events,
                dependencies,
                views,
                models,
                that;
            
            return {
                init: function(_events, _views, _models, _dependencies) {
                    that = this;
                    
                    events = _events;
                    dependencies = _dependencies;
                    views = _views;
                    models = _models;
                },
                
                register: function(event, callback, depends_on) {
                    
                    var context = {
                        dispatch: events.dispatch,
                        map: {
                            controller: that.register,
                            model: models.register,
                            view: views.register,
                            singleton: dependencies.register.singleton,
                            instance: dependencies.register.instance
                        }
                    };
                    
                    if(depends_on)
                      dependencies.inject(context, depends_on);
                                    
                    events.listen(event, callback, context);
                }
            }
        })(),
        
        dependencies: (function() {

            var instances,
                singletons,
                that;

            return {
                init: function() {
                    that = this;
                    
                    instances = {};
                    singletons = {};
                },

                inject: function(inject_into, dependencies) {
                    _.each(dependencies, function(dependency) {
                        if(singletons[dependency]){
                            inject_into[dependency] = singletons[dependency];
                            return;
                        }
                        else if(instances[dependency]){
                            inject_into[dependency] = _.clone(instances[dependency]);
                        }
                    });
                },

                register: {
                    instance: function(name, object) {
                        instances[name] = object;
                    },

                    singleton: function(name, object, dependencies) {
                        if(!singletons[name]) {
                            if(dependencies)
                              that.inject(object, dependencies);
                              
                            if(typeof object.init === 'function')
                              object.init();
                            
                            singletons[name] = object;
                        }
                    }
                }
            }
        })()
    }
    
})();