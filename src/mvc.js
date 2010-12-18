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
    
    var events, dependencies, models, views, controllers, values, imports, exports;

    events = mvc.events();
    dependencies = mvc.dependencies();
    values = mvc.values(dependencies);
    models = mvc.models(events, dependencies);
    views = mvc.views(events, dependencies);
    controllers = mvc.controllers(events, dependencies);
    exports = mvc.exports(events);
    imports = mvc.imports(mvc, dependencies);

    if(!config)
      throw new Error('No config object found');

    if(config.imports)
      imports(config.imports);

    if(config.values)
      values(config.values);
    
    if(config.models)
      models(config.models);

    if(config.views)
      views(config.views);

    if(config.controllers)
      controllers(config.controllers);

    if(config.exports)
      return exports(config.exports);

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
    
    register = function(models) {
        if(!models)
          throw new Error('No models found');

        _.each(models, function(model, key) {
            if(!model.facade)
              throw new Error('No facade found on ' + key + ' model');

            dependencies.register(key, model.facade);

            model.facade.dispatch = events.dispatch;

            if(model.requires)
              dependencies.inject(model.facade, model.requires);

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
mvc.views = function(events, dependencies) {

    var setup_mediator, register_listeners, register;

    /** @private */
    setup_mediator = function(view, name) {

        if(!view.mediator)
          throw new Error('No mediator object found for ' + name + ' view');

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

    /** @private */
    register = function(views) {
        if(!views)
          throw new Error('A view object must be passed');

        _.each(views, function(view, name) {
            register_listeners(view, name);
            setup_mediator(view);
        });
    }

    return register;

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
              throw new Error('No command function found on ' + event + ' controller');

            if(controller.requires && !_.isArray(controller.requires))
              throw new Error('requires property for ' + event + ' controller must be an array of strings');

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
mvc.values = function(dependencies) {

    var register;

    register = function(values) {
        if(!values)
          throw new Error('No values defined');

        _.each(values, function(value, key) {
            dependencies.register(key, value);
        });
    }

    return register;

}

/** @namespace
 *
 */
mvc.plugins = function(events, dependencies) {

    var registered, context;

    registered = {}

    context = {
        dispatch: events.dispatch,
        listen: events.listen,
        dependencies: dependencies
    }

    return {

        register: function(plugins) {
            _.extend(registered, plugins);
        },

        apply: function(config) {
            _.each(config, function(item, key) {
                if(registered[key])
                  registered[key].call(context, item);
            });
        }

    }

}

/** @namespace
 *
 *  Defines that object that will be returned when the mvc function is called. Each function has access to listen and dispatch.
 *  
 *  @param api {Object} Collection of functions that will be externally available.
 *  @param events {Object} Reference to the events objec for the current application.
 *
 */
mvc.exports = function(events) {

    var exports, context, register;

    exports = {},
        
    context = {
        dispatch: events.dispatch,
        listen: events.listen
    }

    register = function(api) {

        _.each(api, function(method, key) {
            
            exports[key] = function() {
                method.apply(context, arguments);
            }

        });

        return exports;

    }

    return register;

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
mvc.imports = function(init, dependencies) {

    var register;

    if(!_.isFunction(init))
      throw new Error('no init function found');

    if(!dependencies)
      throw new Error('no dependency object found');

    register = function(modules) {
        _.each(modules, function(module, name) {
            var instance = init(module);

            dependencies.register(name, instance);
        });
    }

    return register;

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
          throw new Error(event + ' should be a string.');
    }

    /** @private */
    check_params = function(params) {
        if(params && !_.isArray(params))
          throw new Error(params + ' should be an array.');
    }

    /** @private */
    check_callback = function(callback) {
        if(!_.isFunction(callback))
          throw new Error(callback + ' should be a function.');
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
            check_params(params, event);    
        
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
          throw new Error(name + ' should be a string');

        if(registered[name])
          throw new Error(name + ' already exists');
    }

    /** @private */
    check_dependency = function(dependency, name) {
        if(!dependency)
          throw new Error(name + ' does not exist as a registered dependency.');
    }

    /** @private */
    check_target = function(target) {
        if(!target)
          throw new Error('No target defined');
    }

    /** @private */
    check_requires = function(requires) {
        if(!_.isArray(requires))
          throw new Error(requires + ' should be an array');
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
