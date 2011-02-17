var mvc = function(app) {
    
    var events, dependencies, models, views, controllers, config, imports, exports;

    events = mvc.events();
    dependencies = mvc.dependencies();
    config = mvc.config(dependencies);
    models = mvc.models(events, dependencies);
    views = mvc.views(events, dependencies);
    controllers = mvc.controllers(events, dependencies);
    exports = mvc.exports(events);
    imports = mvc.imports(mvc, dependencies);

    if(!config)
      throw new Error('No config object found');

    if(app.imports)
      imports(app.imports);

    if(app.config)
      config(app.config);
    
    if(app.models)
      models(app.models);

    if(app.views)
      views(app.views);

    if(app.controllers)
      controllers(app.controllers);

    if(app.exports)
      return exports(app.exports);

}

mvc.models = function(events, dependencies, collection) {

    var register, create_singleton, create_collection;

    create_singleton = function(name, model) {
        dependencies.register(name, model);
        dependencies.inject(model);
        model.dispatch = events.dispatch;

        if(model.init)
          model.init();
    }

    create_collection = function(name, constructor) {
        name = name.toLowerCase() + 's';
        dependencies.register(name, collection.create(constructor));
    };
    
    register = function(models) {
        if(!models)
          throw new Error('No models found');

        _.each(models, function(model, key) {
            if(_.isFunction(model)) {
                create_collection(key, model);
            }
            else {
                create_singleton(key, model);
            }
        });
    }

    return register;

}

mvc.views = function(events, dependencies) {

    var setup_mediator, register_listeners, register;

    setup_mediator = function(view, name) {

        dependencies.inject(view);
        view.dispatch = events.dispatch;

        if(view.init)
          view.init();

    }

    register_listeners = function(view) {

        _.each(_.functions(view), function(method) {
            if(method !== 'init' && method !== 'dispatch')
              events.listen(method, view[method], view);
        });

    }

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

mvc.controllers = function(events, dependencies) {

    var register;

    register = function(controllers) {
        _.each(controllers, function(controller, event) {
            if(!_.isFunction(controller.command))
              throw new Error('No command function found on ' + event + ' controller');

            var context = {
                dispatch: events.dispatch
            }
            
            _.extend(context, controller);
            
            dependencies.inject(context);

            events.listen(event, controller.command, context);
        });
    }

    return register;

}

mvc.collections = function() {

    
    return {

        create: function(Model) {

            var first, last, order_by, models = [];

            first = function(array) {
                return function(n) {
                    return _.first(array, n);
                }
            };

            last = function(array) {
                return function(n) {
                    var pos = array.length - n;
                    return _.rest(array, pos);
                }
            };

            order_by = function(array) {
                return function(field) {
                    if(_.isString(array[0][field])) {
                        return array.sort(function(a, b) {
                            if (a[field].toLowerCase() < b[field].toLowerCase()) {
                                return -1;
                            }

                            if(a[field].toLowerCase() > b[field].toLowerCase()) {
                                return 1;
                            }

                            return 0;
                        });
                    }
                    else if(_.isNumber(array[0][field])) {
                        return array.sort(function(a, b) {
                            return a[field] - b[field];
                        });
                    }
                    else if(_.isDate(array[0][field])) {
                        return array.sort(function(a, b) {
                            return a[field] - b[field];
                        });
                    }
                }
            };

            if(!_.isFunction(Model)) {
                throw new Error('A constructor function must be passed to collections.create');
            }

            return {

                add: function() {
                    var instance = new Model();
                    Model.apply(instance, arguments);
                    
                    models.push(instance);
                },

                remove: function(filter) {
                    _.each(models, function(model) {
                        var matches = [],
                            count = 0

                        _.each(filter, function(value, key) {
                            count++;

                            if(model[key] === value) {
                                matches.push(true);
                            }
                        });

                        if(matches.length === count) {
                            models = _.without(models, model);
                        }
                    });
                },

                all: function() {
                    var returns = models;
                    returns.first = first(returns);
                    returns.last = last(returns);
                    returns.order_by = order_by(returns);
                    return returns;
                },

                get: function(filter) {
                    var returns = [];

                    _.each(models, function(model) {
                        var matches = [],
                            count = 0

                        _.each(filter, function(value, key) {
                            count++;

                            if(model[key] === value) {
                                matches.push(true);
                            }
                        });

                        if(matches.length === count) {
                            returns.push(model);
                        }
                    });

                    returns.first = first(returns);
                    returns.last = last(returns);
                    returns.order_by = order_by(returns);
                    return returns;
                },

                get_first: function(filter) {
                    results = this.get(filter);
                    return results[0];
                },

                get_last: function(filter) {
                    results = this.get(filter);
                    return _.last(results);
                }

            }

        }

    }

}

mvc.config = function(dependencies) {

    var register;

    register = function(config) {
        if(!config)
          throw new Error('No config defined');

        _.each(config, function(value, key) {
            dependencies.register(key, value);
        });
    }

    return register;

}

mvc.plugins = function(events, dependencies) {

    var registered, context;

    registered = {}

    context = {
        dispatch: events.dispatch,
        listen: events.listen,
        dependencies: dependencies
    };

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

    };

}

mvc.exports = function(events) {

    var exports, context, register;

    exports = {};
        
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

mvc.events = function() {

    var registered, register_event, check_event, check_params, check_callback;

    registered = {};

    register_event = function(event, callback, context) {
        check_event(event);
        check_callback(callback);

        if(!registered[event])
          registered[event] = [];

        registered[event].push({ fn: callback, context: context });
    }

    check_event = function(event) {
        if(typeof event !== 'string')
          throw new Error(event + ' should be a string.');
    }

    check_params = function(params) {
        if(params && !_.isArray(params))
          throw new Error(params + ' should be an array.');
    }

    check_callback = function(callback) {
        if(!_.isFunction(callback))
          throw new Error(callback + ' should be a function.');
    }

    return {

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

        listen: function(event, callback, context) {
            register_event(event, callback, context);
        }

    }
    
};

mvc.dependencies = function() {

    var registered, check_registered, check_dependency, check_target;

    registered = {};

    check_registered = function(name) {
        if(!_.isString(name))
          throw new Error(name + ' should be a string');

        if(registered[name])
          throw new Error(name + ' already exists');
    }

    check_dependency = function(dependency, name) {
        if(!dependency)
          throw new Error(name + ' does not exist as a registered dependency.');
    }

    check_target = function(target) {
        if(!target)
          throw new Error('No target defined');
    }
   
    return {

        inject: function(target) {
            check_target(target);
            
            var regex = /(?:^__inject:)(.+)(?:__$)/;
                        
            _.each(_.keys(target), function(dependency) {
                var inject_string = target[dependency],
                    match = regex.exec(inject_string);

                if (match) {
                    target[dependency] = registered[match[1]];
                }
                else if(inject_string === '__inject__') {
                    target[dependency] = registered[dependency];
                }

            });
        },

        register: function(name, dependency) {
            check_dependency(dependency, name);
            check_registered(name);

            registered[name] = dependency;
        }
    }

}
