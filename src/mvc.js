/**
 * Simple MVC framework for client-side javascript applications.
 * @fileOverview Simple MVC framework for client-side javascript applications.
 * @author Richard Layte
 * @version 0.0.3
 */

/** @namespace
 *  
 *  @param config {Object} Central object that defines the application models, views, controllers. The external API can also be defined by setting a property of exports.
 *
 */
var mvc = function(config) {
    
    var events, dependencies;

    events = mvc.events();
    dependencies = mvc.dependencies();

    if(!config)
      throw new Error('No config object found');

    if(config.imports)
      mvc.imports(config.import, mvc, dependencies);
    
    if(config.models)
      mvc.models(config.models, events, dependencies);

    if(config.views)
      mvc.views(config.views, events, dependencies);

    if(config.controllers)
      mvc.controllers(config.controllers, events, dependencies);

    if(config.exports)
      return mvc.exports(config.exports, events);
}

/** @namespace 
 *  
 *  @param models {Object} Collection of model objects. Each must define a facade, which is given a reference to events.dispatch and is registered as a dependency object.
 *  @param events {Object} Reference to the events object.
 *  @param dependencies {Object} Reference to the dependencies object
 *
 */
mvc.models = function(models, events, dependencies) {
    if(!models)
      throw new Error('No models found');
    
    _.each(models, function(model, key) {
        dependencies.register(key, model.facade);

        model.facade.dispatch = events.dispatch;

        if(model.facade.init)
          model.facade.init()
    });
}

/** @namespace 
 *
 *  @param views {Object} Collection of views. Each must define a mediator object, which is given a reference to events.dispatch. If an init method is found it will be automatically called, any other methods are registered as event listeners. Optionally a view element and external dependencies can be defined.
 *  @param events {Object} Reference to the the object.
 *  @param dependencies {Object} Reference to the dependencies object
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
 *  @param controllers {Object} Collection of functions which are mapped to defined events.
 *  @param events {Object} Reference to the the object.
 *  @param dependencies {Object} Reference to the dependencies object
 *
 */
mvc.controllers = function(controllers, events, dependencies) {
    
    _.each(controllers, function(controller, event) {
        var context = {
            dispatch: events.dispatch
        }

        if(!_.isFunction(controller.command))
          throw new Error('No command function found');

        if(controller.requires && !_.isArray(controller.requires))
          throw new Error('Requirements must be an array');

        if(controller.requires)
          dependencies.inject(context, controller.requires);

        events.listen(event, controller.command, context);
    });
}

/** @namespace
 *  
 *  @param api {Object} External API for controlling the application
 *  @param events {Object} Reference to the events object
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
 *  @param requires {Object} Applications that the parent application relies upon.
 *  @param init {Object} Reference to the main mvc function
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

/** @namespace */
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

        /** @scope mvc.events
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
         * @param event {String} Unique identifier that selects the callbacks to be triggered
         * @param callback {Function} Called when event string is dispatched
         * @param context {Object} Context in whcih the callback is applied. By default the context is the event object
         *
         */
        listen: function(event, callback, context) {
            register_event(event, callback, context);
        }

    }
    
};

/** @namespace */
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
