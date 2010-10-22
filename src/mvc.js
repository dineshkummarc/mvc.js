
/** @namespace */
var mvc = (function() {
	
	/** @private */
	var setup = function(instance, context) {
		instance.events.init();
        instance.dependencies.init();
        
        instance.models.init(instance.events.dispatch, instance.dependencies);
        instance.views.init(instance.events, instance.dependencies);
        instance.controllers.init(instance.events, instance.views, instance.models, instance.dependencies);
        
        instance.controllers.register('start_up', context);
        instance.events.dispatch('start_up');
	}
    
	/** @scope mvc */
    return {
        
		/** Creates a new mvc application
			@param {Function} context 	
			Registered as a controller, therefore has all the standard functionality available to controllers. Used to define and wire together application objects.
		
		*/
        create: function(context) {
            var instance = _.clone(mvc);
            setup(instance, context);
        },
        
		/** @namespace */
        events: (function() {
			
				/** @private */
            var registered,
				
				/** @private */
                contexts;
				
			/** @scope mvc.events */
            return {
				
				/** Assigns contexts and registered as empty objects
				*/
                init: function() {
                    contexts = registered = {};
                },

				/** Assigns a callback function to trigger when the specified event string is fired.
					@param event {String}
					@param callback {Function}
					@param [context] {Object}
				 */
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

				/** Removes a specific event listener
					@param event {String}
					@param callback {Function}
				*/
                remove: function(event, callback) {
                    var callbacks = registered[event].callbacks,
                        position = _.indexOf(callbacks, callback);

                    if(position !== -1) {
                        callbacks.splice(position, 1);
                    }
                },
				
				/** Removes all event listeners for that event string
					@param event {String}
				*/
                removeAll: function(event) {
                    registered[event] = [];
                },

				/** Calls all functions registered to the event
					@param event {String}
					@param [params] {Array}
				*/
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
        
		/** @namespace */
        models: (function() {
            
				/** @private */
            var dispatch,

				/** @private */
                dependencies;
            
			/** @scope mvc.models */
            return {
                
				/** Sets up dispatch and dependencies variables
				@param _dispatch {Function} Reference to events.dispatch
				@param _dependencies {Object} Reference to dependencies
				*/
                init: function(_dispatch, _dependencies) {
                    dispatch = _dispatch;
                    dependencies = _dependencies
                },
                
				/** Register a model as a singleton and adds a reference to events.dispatch
				@param name {String} Identify that is used to later define the model as a dependency
				@param model {Object} 
				*/
                register: function(name, model) {
                    model.dispatch = dispatch;
                    dependencies.register.singleton(name, model, model.dependencies);
                }
            }
            
        })(),
        
		/** @namespace */
        views: (function() {
            
				/** @private */
            var events,

				/** @private */
                dependencies;
				
			/** @scope mvc.views */
            return {
	
				/** Sets up events and dependencies variables
				@param _events {Function} Reference to events
				@param _dependencies {Object} Reference to dependencies
				*/
                init: function(_events, _dependencies) {
                    events = _events;
                    dependencies = _dependencies;
                },
                
				/** Registers a view object to handle a specified element. If multiple elements are passed a new view object is created for each one.
				@param element {Object} The element that the view manipulates, usually an HTML node, but could also be the address bar, console, etc.
				@param view {Object} The object that mediates interaction between the view and framework. If an init function is found it will be called immediately to allow initial state to be defined. All other functions are automatically assigned as event listeners based on their names. Dependencies can be defined by setting an array of strings as a propert on the view object. 
				*/
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
        
		/** @namespace */
        controllers: (function() {
            	
				/** @private */
            var events,
				
				/** @private */
                dependencies,

				/** @private */
                views,

				/** @private */
                models,

				/** @private */
                that;
            
			/** @scope mvc.controllers */
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
        
		/** @namespace */
        dependencies: (function() {
			
				/** @private */
            var instances,

				/** @private */
                singletons,

				/** @private */
                that;

			/** @scope mvc.dependencies */
            return {
                init: function() {
                    that = this;
                    
                    instances = {};
                    singletons = {};
                },

                inject: function(inject_into, dependencies) {
                    _.each(dependencies, function(dependency) {
                        if(singletons[dependency]) {
                            inject_into[dependency] = singletons[dependency];
                            return;
                        }
                        else if(instances[dependency]) {
                            var instance = _.clone(instances[dependency]);
                            
                            if(typeof instance.init === 'function')
                              instance.init();
                            
                            inject_into[dependency] = instance;
                        }
                    });
                },

				/** @scope mvc.dependencies.register */
                register: {
                    instance: function(name, object, dependencies) {
                        if(dependencies)
                          that.inject(object, dependencies);
                        
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