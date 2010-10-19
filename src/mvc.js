var mvc = (function() {
    
    return {
        
        create: function(context) {
            var instance = _.clone(mvc);
            
            instance.init(context);
        },
        
        init: function(context) {
            this.events.init();
            this.models.init(this.events.dispatch);
            this.dependencies.init(this.models);
            this.views.init(this.events, this.dependencies);
            this.controllers.init(this.events, this.dependencies);
            
            var that = this;
            
            context.apply({
                dispatch: this.events.dispatch,
                map: {
                    event: this.controllers.register,
                    
                    singleton: this.models.register,
                    
                    view: function(elements, view) {
                        _.each(elements, function(el) {
                            that.views.register(el, view);
                        })
                    }
                }
            });

            this.events.dispatch('startup_complete')
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
                        registered[event] = {};
                        registered[event].callbacks = [];
                        registered[event].contexts = [];
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
            
            var registered,
                dispatch;
            
            return {
                
                init: function(_dispatch) {
                    registered = {};
                    dispatch = _dispatch;
                },
                
                register: function(name, model) {
                    
                    if(registered[name])
                      return;
                    
                    registered[name] = model;
                    
                    if(model.init)
                      model.init();
                      
                    model.dispatch = dispatch;
                },

                get: function(name) {
                    return registered[name];
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
                    var view_instance = _.clone(view),
                        methods = _.functions(view_instance);
                        
                    if(view_instance.dependencies) {
                        dependencies.inject(view_instance, view_instance.dependencies);
                    }
                      
                    for(var i = 0, l = methods.length; i < l; i++) {
                        if(methods[i] !== 'init')
                          events.listen(methods[i], view_instance[methods[i]], view_instance);
                    }
                    
                    view_instance.element = element;
                    view_instance.events = events;

                    if(view_instance.init)
                      view_instance.init();
                }
            }
        })(),
        
        controllers: (function() {
            
            var events,
                dependencies;
            
            return {
                init: function(_events, _dependencies) {
                    events = _events;
                    dependencies = _dependencies;
                },
                
                register: function(event, callback, depends_on) {
                    var context = {
                        dispatch: events.dispatch
                    };
                    
                    if(depends_on)
                      dependencies.inject(context, depends_on);
                                    
                    events.listen(event, callback, context);
                }
            }
        })(),
        
        dependencies: (function() {
            
            var models;
            
            return {
                init: function(_models) {
                    models = _models;
                },
                
                inject: function(inject_into, dependencies) {
                    _.each(dependencies, function(dependency) {
                        inject_into[dependency] = models.get(dependency);
                    });
                }
            }
        })()
    }
    
})();