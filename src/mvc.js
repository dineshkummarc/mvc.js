var mvc = (function() {
    
    return {
        
        create: function(context) {
            var instance = _.clone(this);
            
            instance.init(context);
            
            return {
                
            };
        },
        
        init: function(context) {
            this.events.init();
            this.models.init(this.events.dispatch);
            
            context();

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

                    for(var i = 0, l = callbacks.length; i < l; i++) {
                        callbacks[i].apply(this, params);
                    }
                }

            }

        })(),
        
        models: (function() {
            
            var registered,
                dispatch;
            
            return {
                
                init: function(dispatch_ref) {
                    registered = {};
                    dispatch = dispatch_ref;
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
                models,
                elements = [];

            return {
                init: function(_events, _models) {
                    events = _events;
                    models = _models;
                },
                
                register: function(element, view) {
                    elements.push(element);

                    view.element = element;

                    if(view.init)
                      view.init();
                      
                    var methods = _.functions(view);
                      
                    for(var i = 0, l = methods.length; i < l; i++) {
                        if(methods[i] !== 'init')
                          events.listen(methods[i], view[methods[i]]);
                    }
                }
            }
        })()
    }
    
})();