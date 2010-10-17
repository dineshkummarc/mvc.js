var mvc = (function() {
    
    return {
        
        create: function(context) {
            var instance = _.clone(mvc);
            
            instance.init(context);
        },
        
        init: function(context) {
            this.events.init();
            this.models.init(this.events.dispatch);
            this.views.init(this.events, this.models.get);
            this.controllers.init(this.events, this.models);
            
            context.apply({
                dispatch: this.events.dispatch,
                register: {
                    controller: this.controllers.register,
                    model: this.models.register,
                    view: this.views.register
                }
            });

            this.events.dispatch('startup_complete')
        },
        
        events: (function() {

            var registered;

            return {

                init: function() {
                    registered = {};
                },

                listen: function(event, callback) {
                    if(!registered[event])
                      registered[event] = [];

                    registered[event].push(callback);
                },

                remove: function(event, callback) {
                    var callbacks = registered[event],
                        position = _.indexOf(callbacks, callback);

                    if(position !== -1) {
                        callbacks.splice(position, 1);
                    }
                },

                removeAll: function(event) {
                    registered[event] = [];
                },

                dispatch: function(event, params) {
                    var callbacks = registered[event];
                    
                    if(callbacks) {
                        for(var i = 0, l = callbacks.length; i < l; i++) {
                            callbacks[i].apply(this, params);
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
                models;

            return {
                init: function(_events, _models) {
                    events = _events;
                    models = _models;
                },
                
                register: function(element, view) {
                    var methods = _.functions(view);
                      
                    for(var i = 0, l = methods.length; i < l; i++) {
                        if(methods[i] !== 'init')
                          events.listen(methods[i], view[methods[i]]);
                    }
                    
                    view.element = element;
                    view.events = events;
                    view.models = models;

                    if(view.init)
                      view.init();
                }
            }
        })(),
        
        controllers: (function() {
            
            var events,
                models;
            
            return {
                init: function(_events, _models) {
                    events = _events;
                    models = _models;
                },
                
                register: function(event, callback) {                    
                    events.listen(event, callback);
                }
            }
        })()
    }
    
})();