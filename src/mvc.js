/**
 * Simple MVC framework for client-side javascript applications.
 * @fileOverview Simple MVC framework for client-side javascript applications.
 * @author Richard Layte
 * @version 0.0.1
 */


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
			@param context {Function} Registered as a controller, therefore has all the standard functionality available to controllers. Used to define and wire together application objects.
		
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
					@param event {String} Unique identifier that triggers all registered callbacks when dispatched
					@param callback {Function} Called when event string is dispatched
					@param [context] {Object} Context in whcih the callback is applied. By default the context is the event object.
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
                    dependencies = _dependencies;
                },
                
				/** Register a model as a singleton and adds a reference to events.dispatch
				@param name {String} Identify that is used to later define the model as a dependency
				@param model {Object} Defines the API that is used to set and retrieve data. If init method exists it will be automatically called. All methods have access to event.dispatch via this.dispatch
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
				@param view {Object} The object that mediates interaction between the view and framework. If an init function is found it will be called immediately to allow initial state to be defined. The view element is provided as a property on the object, i.e. this.element. The events object is fully accessible as this.events. All other functions are automatically assigned as event listeners based on their names. Additional dependencies can be defined by setting an array of strings as a propert on the view object. 
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
	
				/** Sets up events, views, models, and dependencies
					@param _events {Object}
					@param _views {Object}
					@param _models {Obejct}
					@param _dependencies {Obejct}
				*/
                init: function(_events, _views, _models, _dependencies) {
                    that = this;
                    
                    events = _events;
                    dependencies = _dependencies;
                    views = _views;
                    models = _models;
                },
                
				/** Allows you to register seperate functions to react to defined event strings
					@param event {Object} Triggers the command
					@param callback {Object} Triggered when event is event is dispatched
					@param depends_on {Object} Adds any additional registered dependencies
				*/
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
	
				/** Sets up internal instances and singletons objects.
				*/
                init: function() {
                    that = this;
                    
                    instances = {};
                    singletons = {};
                },
				
				/** Looks up all required dependencies and injects them as public properties of the supplied object
					@param inject_into {Object} Target object that dependencies are inject into
					@param dependencies {Array} list of strings to identify what the target object depends upon
				*/
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

				/** @namespace */
                register: {
	
					/** Creates a new instance of the object whenever requested as a dependency
						@param name {String} Used to pull back the object as a dependency
						@param obejct {Object}
						@param [dependencies] {Array} Any predefined dependencies will be injected if found
					*/
                    instance: function(name, object, dependencies) {
                        if(dependencies)
                          that.inject(object, dependencies);
                        
                        instances[name] = object;
                    },
					
					/** Registers object as a global reference
						@param name {String} Used to pull back the object as a dependency
						@param obejct {Object}
						@param [dependencies] {Array} Any predefined dependencies will be injected if found
					*/
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