/**
 * Simple MVC framework for client-side javascript applications.
 * @fileOverview Simple MVC framework for client-side javascript applications.
 * @author Richard Layte
 * @version 0.0.4
 */

/** @namespace
 *
 *  Used to create instances of mvc.js applications. It takes a config object that defines the application objects.
 *  
 *  @param config {Object} Used to define the application's models, views, and controllers as well as arbitrary values. It also provides the mechanism for importing ubmodules using the imports object and defining a return API by defining an exports object.
 *  
 */
var mvc = function(config) {
    
    var events, dependencies, models, controllers;

    events = mvc.events();
    dependencies = mvc.dependencies();
    models = mvc.models(events, dependencies);
    controllers = mvc.controllers(events, dependencies);

    if(!config)
      throw new Error('No config object found');

    if(config.imports)
      mvc.imports(config.imports, mvc, dependencies);

    if(config.values)
      mvc.values(config.values, dependencies);
    
    if(config.models)
      models(config.models);

    if(config.views)
      mvc.views(config.views, events, dependencies);

    if(config.controllers)
      controllers(config.controllers);

    if(config.exports)
      return mvc.exports(config.exports, events);

}

/** @namespace 
 *
 *  Takes a collection of models objects and defines each as a dependency using the object's key as the id. Each model is given a reference to the events.dispatch method to allow the system to be notified when updates are made.
 *  
 *  @param models {Object} Collection of model objects. Each must contain a facade object which defines a public API. Optionally dependencies can be set by defining a requires property with an array of strings.
 *  @param events {Object} Reference to the events object for the current application.
 *  @param dependencies {Object} Reference to the dependencies object for the current application.
 *
 */
mvc.models = function(events, dependencies) {

    var register;

    if(!models)
      throw new Error('No models found');
    
    register = function(models) {
        _.each(models, function(model, key) {
            dependencies.register(key, model.facade);

            model.facade.dispatch = events.dispatch;

            if(model.facade.init)
              model.facade.init()
        });
    }

    return register;

}

/** @namespace 
 *
 *  Takes a collection of views and assigns references to dispatch, listen, the view element, any required dependencies.
 *
 *  @param views {Object} Collection of views. Each must define a mediator object, which is given a reference to events.dispatch and events.listen. If an init method is found it will be automatically called, any other public methods are automatically registered as event listeners. Optionally a view element can be defined as well as any external dependencies by setting an array of strings on the requires property.
 *  @param events {Object} Reference to the the events object for the current application.
 *  @param dependencies {Object} Reference to the dependencies object for the current application.
 */
mvc.views = function(views, events, dependencies) {

    var setup_mediator, register_listeners, check_views;

    /** @private */
    check_views = function(views) {
        if(!views)
          throw new Error('A view object must be passed');
    }

    /** @private */
    setup_mediator = function(view) {

        if(!view.mediator)
          throw new Error('A mediator must be defined on view objects');

        if(view.element)
          view.mediator.element = view.element;

        if(view.requires)
          dependencies.inject(view.mediator, view.requires);
        
        view.mediator.dispatch = events.dispatch;

        if(view.mediator.init)
          view.mediator.init();

    }

    /** @private */
    register_listeners = function(view) {

        _.each(_.functions(view.mediator), function(method) {
            if(method !== 'init' && method !== 'dispatch')
              events.listen(method, view.mediator[method], view.mediator);
        });

    }

    check_views(views);

    _.each(views, function(view) {
        register_listeners(view);
        setup_mediator(view);
    });

}

/** @namespace
 *
 *  Takes a collection of conntroller objects, which must define a command function. The command function is provided with references to dispatch, listen and any dependencies listed in the requires array.
 *
 *  @param controllers {Object} Collection of functions which are mapped to defined events.
 *  @param events {Object} Reference to the the events object for the current application.
 *  @param dependencies {Object} Reference to the dependencies object for the current application.
 *
 */
mvc.controllers = function(events, dependencies) {

    var context, register;
    
    context = {
        dispatch: events.dispatch
    }

    register = function(controllers) {
        _.each(controllers, function(controller, event) {
            if(!_.isFunction(controller.command))
              throw new Error('No command function found');

            if(controller.requires && !_.isArray(controller.requires))
              throw new Error('Requirements must be an array');

            if(controller.requires)
              dependencies.inject(context, controller.requires);

            events.listen(event, controller.command, context);
        });
    }

    return register;

}

/** @namespace
 *
 *  Maps a collection of arbitrary values as dependencies. Can be used to set application wide configuration properties.
 *  
 *  @param values {Object} Object of values to register as available dependencies
 *  @param events {Object} Reference to the dependencies object for the current application.
 *
 */
mvc.values = function(values, dependencies) {

    if(!values)
      throw new Error('No values defined');

    _.each(values, function(value, key) {
        dependencies.register(key, value);
    });

}

/** @namespace
 *
 */
mvc.plugins = function(plugins) {

}

/** @namespace
 *
 *  Defines that object that will be returned when the mvc function is called. Each function has access to listen and dispatch.
 *  
 *  @param api {Object} Collection of functions that will be externally available.
 *  @param events {Object} Reference to the events objec for the current application.
 *
 */
mvc.exports = function(api, events) {

    var exports, context;

    exports = {},
        
    context = {
        dispatch: events.dispatch,
        listen: events.listen
    }

    _.each(api, function(method, key) {
        
        exports[key] = function() {
            method.apply(context, arguments);
        }

    });

    return exports;

}

/** @namespace
 *
 *  Takes a collection of application config objects and creates a new instance of each. The imported applications are then registered as dependencies on the current application using the key string as the id.
 *  
 *  @param modules {Object} Applications that the parent application relies upon. Each object is automatically used to create an mvc application.
 *  @param init {Object} Reference to the main mvc function for the current application.
 *  @param dependencies {Object} Reference to the dependencies object for the current application.
 *
 */
mvc.imports = function(modules, init, dependencies) {

    if(!_.isFunction(init))
      throw new Error('no init function found');

    if(!dependencies)
      throw new Error('no dependency object found');

    _.each(modules, function(module, name) {
        var instance = init(module);

        dependencies.register(name, instance);
    });

}

/** @namespace
 *
 *  Implements the observer pattern by returning an object with dispatch and listen methods.
 *
 */
mvc.events = function() {

    var registered, register_event, check_event, check_params, check_callback;

    /** @private */
    registered = {};

    /** @private */
    register_event = function(event, callback, context) {
        check_event(event);
        check_callback(callback);
        
        if(!registered[event])
          registered[event] = [];

        registered[event].push({ fn: callback, context: context });
    }

    /** @private */
    check_event = function(event) {
        if(typeof event !== 'string')
          throw new Error('An event string must be passed to events.dispatch');
    }

    /** @private */
    check_params = function(params) {
        if(params && !_.isArray(params))
          throw new Error('params must be an array');
    }

    /** @private */
    check_callback = function(callback) {
        if(!_.isFunction(callback))
          throw new Error('A callback function must be passed to events.dispatch');
    }

    return {

        /** 
         *
         *  Calls any functions listening for the event string.
         *
         *  @param event {String} Unique identifier that triggers all registered callbacks
         *  @param param {Array} Optional arguments to pass to the callback functions
         *
         */
        dispatch: function(event, params) {
            check_event(event);
            check_params(params);    
        
            if(registered[event]) {
                _.each(registered[event], function(callback) {
                    var context = callback.context || this;

                    callback.fn.apply(context, params);
                });
            }
        },

        /**
         *
         *  Registers the callback function as a listener for the defined event string.
         *
         *  @param event {String} Unique identifier that selects the callbacks to be triggered
         *  @param callback {Function} Called when event string is dispatched
         *  @param context {Object} Context in whcih the callback is applied. By default the context is the event object
         *
         */
        listen: function(event, callback, context) {
            register_event(event, callback, context);
        }

    }
    
};

/** @namespace
 *
 *  Returns an object with inject and register methods.
 *
 * */
mvc.dependencies = function() {

    var registered, check_registered, check_dependency, check_target, check_requires;

    /** @private */
    registered = {};

    /** @private */
    check_registered = function(name) {
        if(!_.isString(name))
          throw new Error('Name parameter must be a string');

        if(registered[name])
          throw new Error('Dependency already exists');
    }

    /** @private */
    check_dependency = function(dependency, name) {
        if(!dependency)
          throw new Error('No dependency object found for ' + name);
    }

    /** @private */
    check_target = function(target) {
        if(!target)
          throw new Error('No target defined');
    }

    /** @private */
    check_requires = function(requires) {
        if(!_.isArray(requires))
          throw new Error('No requires array found');
    }
   
    return {

        /**
         *  
         *  Appends the required dependencies as properties on the target object.
         *
         *  @param target {Object} Target object that dependencies are inject into
         *  @param requires {Array} List of strings to identify what the target object depends upon
         *
         */
        inject: function(target, requires) {
            check_target(target);
            check_requires(requires);

            _.each(requires, function(dependency) {
                target[dependency] = registered[dependency];
            });
        },

        /**
         *
         *  Registers objects as dependencies that can be injected into other objects.
         *
         *  @param name {String} Used to pull back the object as a dependency
         *  @param dependency {Object} Any predefined dependencies will be injected if found
         *
         */
        register: function(name, dependency) {
            check_dependency(dependency, name);
            check_registered(name);

            registered[name] = dependency;
        }
    }

}
