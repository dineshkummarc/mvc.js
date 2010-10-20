TestCase("init", {
    setUp: function(){
        context = xray_specs.stub();
        
        xray_specs.mock(mvc, 'events', {
            init: {},
            dispatch: {}
        });
        
        xray_specs.mock(mvc, 'models', {
            init: {}
        });
        
        xray_specs.mock(mvc, 'views', {
            init: {},
            register: {}
        });
        
        xray_specs.mock(mvc, 'controllers', {
            init: {}
        });
        
        xray_specs.mock(mvc, 'dependencies', {
            init: {}
        });
        
        app = mvc.create(context);
    },
    tearDown: function() {
        mvc.events.reset();
        mvc.models.reset();
        mvc.views.reset();
        mvc.dependencies.reset();
        mvc.controllers.reset();
    },
    
    "test that context function is called": function(){
        mvc.controllers.expects('register')
          .to_be_called.times(1)
            .with_args.matching('start_up', context);
            
        assertTrue(mvc.controllers.verify());
    },
    
    "test that the events object is initialised": function(){
        mvc.events.expects('init')
          .to_be_called.times(1);
          
        assertTrue(mvc.events.verify());
    },
    
    "test that once context has been set up a startup_complete event is triggered": function(){
        mvc.events.expects('dispatch')
          .to_be_called.times(1)
            .with_args.including('start_up');
            
        assertTrue(mvc.events.verify());
    },
    
    "test that models is initialised": function(){
        mvc.models.expects('init')
          .to_be_called.times(1)
            .with_args.matching(mvc.events.dispatch, mvc.dependencies);
          
        assertTrue(mvc.models.verify());
    },
    
    "test that views is initialised": function(){
        mvc.views.expects('init')
          .to_be_called.times(1)
            .with_args.matching(mvc.events, mvc.dependencies);
          
        assertTrue(mvc.views.verify());
    },
    
    "test that dependencies is initialised": function(){
        mvc.dependencies.expects('init')
          .to_be_called.times(1);
          
        assertTrue(mvc.dependencies.verify());
    },
    
    "test that controllers is initialised": function(){
        mvc.controllers.expects('init')
          .to_be_called.times(1)
            .with_args.matching(mvc.events, mvc.views, mvc.models, mvc.dependencies);
          
        assertTrue(mvc.controllers.verify());
    }
    
});

TestCase("events", {
    setUp: function(){
        listener = xray_specs.stub();
        mvc.events.init();
    },
    
    "test that dispatching an event notifies registered listeners": function(){
        mvc.events.listen('hello', listener);
        
        mvc.events.dispatch('hello');
        mvc.events.dispatch('hello');
        mvc.events.dispatch('hello');
        
        assertTrue(listener.called_at_least(3));
    },
    
    "test that multiple events can be registered": function(){
        mvc.events.listen('hello', listener);
        mvc.events.listen('again', listener);
        
        mvc.events.dispatch('hello');
        mvc.events.dispatch('again');
        
        assertTrue(listener.called_at_least(2));
    },
    
    "test that multiple callbacks can be registered to the same event": function(){
        var another_listener = xray_specs.stub();
        
        mvc.events.listen('hello', listener);
        mvc.events.listen('hello', another_listener);
        
        mvc.events.dispatch('hello');
        
        assertTrue(listener.called());
        assertTrue(another_listener.called());
    },
    
    "test that arguments can be passed through with events": function(){
        mvc.events.listen('hello', listener);
        
        mvc.events.dispatch('hello', ['World']);
        
        assertTrue(listener.called_with_exactly('World'));
    },
    
    "test that multiple arguments can be passed": function(){
        mvc.events.listen('hello', listener);
        
        mvc.events.dispatch('hello', ['Cruel', 'World']);
        
        assertTrue(listener.called_with_exactly('Cruel', 'World'));
    },
    
    "test that event callbacks can be removed": function(){
        mvc.events.listen('hello', listener);
        mvc.events.removeAll('hello');
        
        mvc.events.dispatch('hello');
        
        assertFalse(listener.called());
    },
    
    "test that specific listeners can be removed": function(){
        var another_listener = xray_specs.stub();
        
        mvc.events.listen('hello', listener);
        mvc.events.listen('hello', another_listener);
        
        mvc.events.remove('hello', listener);
        
        mvc.events.dispatch('hello');
        
        assertFalse(listener.called());
        assertTrue(another_listener.called());
    },
    
    "test that you can specify a context for the callback to fire in": function(){
        var another_planet = {
            lyrics: xray_specs.stub()
        }
        
        var callback = function() {
            this.lyrics();
        }
        
        mvc.events.listen('another_girl', callback, another_planet);
        mvc.events.dispatch('another_girl');
        
        assertTrue(another_planet.lyrics.called());
    }
    
});

TestCase("models", {
    setUp: function(){
        dispatch = xray_specs.stub();
        
        dependencies = {
            register: {
                singleton: xray_specs.stub()
            }
        }
        
        mvc.models.init(dispatch, dependencies);
    },
    
    "test that models can be registered to a key/value store": function(){
        mvc.models.register('items', 'items_model');
        
    },
    
    "test that models are given a reference to dispatch": function(){   
        var model = {};
         
        mvc.models.register('items', model);
        
        assertEquals(dispatch, model.dispatch);
    }
});

TestCase("views", {
    setUp: function(){
        /*:DOC +=
            <div id="jstd">
                <div class="list">
                    <h1>This is a list</h1>
                </div>
                
                <div class="list">
                    <h1>This is another list</h1>
                </div>
            </div>
        */
        
        xray_specs.mock(mvc, 'events', {
            dispatch: {},
            listen: {}
        });
        
        xray_specs.mock(mvc, 'dependencies', {
            inject: {}
        });
        
        mvc.views.init(mvc.events, mvc.dependencies);
    },
    
    tearDown: function() {
        mvc.events.reset();
        mvc.dependencies.reset();
    },
    
    "test that init is called if present": function(){
        var init = xray_specs.stub();
        
        mvc.views.register($('.list'), {
            init: init
        });
        
        assertTrue(init.called());
    },
    
    "test that views can manipulate their corresponding elements": function(){
        mvc.views.register($('.list'), {
            init: function() {
                $(this.element).hide();
            }
        });
        
        assertTrue($('.list').is(':hidden'));
    },
    
    "test that each function is assigned a listener": function(){
        mvc.events.expects('listen')
          .to_be_called.times(2)
            .with_args.always_including('item_registered', 'item_removed');
        
        mvc.views.register($('.list'), {
            item_registered: function() {},
            item_removed: function() {}
        });
        
        assertTrue(mvc.events.verify());
    },
    
    "test that init is not assigned as a listener": function(){
        mvc.events.expects('listen')
          .to_be_called.times(2);
          
        mvc.views.register($('.list'), {
            init: function() {},
            item_registered: function() {},
            item_removed: function() {}
        });
        
        assertTrue(mvc.events.verify());
    },
    
    "test that views can dispatch events": function(){
        mvc.events.expects('dispatch')
          .to_be_called.times(1)
            .with_args.matching('view_initialised');
            
        mvc.views.register($('.list'), {
            init: function() {
                this.events.dispatch('view_initialised');
            }
        });
        
        assertTrue(mvc.events.verify());
    },
    
    "test that views can listen for events": function(){
        mvc.events.expects('listen')
          .to_be_called.times(1)
            .with_args.matching('view_initialised');
            
        mvc.views.register($('.list'), {
            init: function() {
                this.events.listen('view_initialised');
            }
        });
        
        assertTrue(mvc.events.verify());
    },
    
    "test that views can define dependencies": function(){
        mvc.dependencies.expects('inject')
          .to_be_called.times(1)
            .with_args.including('items');
        
        mvc.views.register($('.list'), {
            dependencies: 'items'
        });
        
        assertTrue(mvc.dependencies.verify());
    },
    
    "test that each view is registered": function(){
        var view = {
            do_something: function() {}
        }
        
        mvc.views.register($('.list'), view);
        
        // TODO: Think of a way to verify a new view is created for every element
    }
    
});

TestCase("controllers", {
    setUp: function(){
        xray_specs.mock(mvc, 'events', {
            dispatch: {},
            listen: {}
        });
        
        xray_specs.mock(mvc, 'views', {
            register: {}
        });
        
        xray_specs.mock(mvc, 'events', {
            register: {}
        });
        
        xray_specs.mock(mvc, 'dependencies', {
            inject: {}
        });
        
        mvc.controllers.init(mvc.events, mvc.views, mvc.models, mvc.dependencies);
    },
    
    tearDown: function() {
        mvc.events.reset();
        mvc.dependencies.reset();
    },
    
    "test that functions can be registered as controllers": function(){
        mvc.events.expects('listen')
          .with_args.including('item_added');
        
        mvc.controllers.register('item_added', function() {});
        
        assertTrue(mvc.events.verify());
    },
    
    "test that dependencies are injected by arguments": function(){
        mvc.dependencies.expects('inject')
          .to_be_called.times(1)
            .with_args.including('items');
        
        mvc.controllers.register('item_added', function() {}, 'items');
        
        assertTrue(mvc.dependencies.verify());
    },
    
    "test that dispatch is available to the context function": function(){
        var dispatch;
        
        mvc.create(function() {
            dispatch = this.dispatch;
        });
        
        assertEquals(mvc.events.dispatch, dispatch);
    },
    
    "test that map.event is available to context": function(){
        var map_event;
        
        mvc.create(function() {
            map_event = this.map.event;
        });
        
        assertEquals(mvc.controllers.register, map_event);
    },
    
    "test that map.singleton is available to context": function(){
        var map_singleton;
        
        mvc.create(function() {
            map_singleton = this.map.singleton;
        });
        
        assertEquals(mvc.models.register, map_singleton);
    }
});

TestCase("dependencies", {
    setUp: function(){
        xray_specs.mock(mvc, 'models', {
            get: {}
        });
        
        mvc.dependencies.init(mvc.models);
    },
    
    tearDown: function() {
        mvc.models.reset();
    },
    
    "test that models are searched for dependencies": function(){
        mvc.models.expects('get')
          .to_be_called.times(2)
            .with_args.including('items', 'cart');
            
        mvc.dependencies.inject({}, ['items', 'cart']);
        
        assertTrue(mvc.models.verify());
    },
    
    "test that target object is injected with dependencies": function(){
        mvc.models.get.returns('this was injected');
        
        var target = {};
            
        mvc.dependencies.inject(target, ['items', 'cart']);
        
        assertEquals('this was injected', target.items);
        assertEquals('this was injected', target.cart);
    },
    
    "test that instances can be registered as dependencies": function(){
        var data = {
            get: function() {
                this.called = true;
            }
        }
        
        mvc.dependencies.register.instance('data_object', data);
        
        var target = {};
        mvc.dependencies.inject(target, ['data_object']);
        
        target.data_object.get();
        
        assertTrue(target.data_object.called);
        assertEquals(undefined, data.called);
    },
    
    "test that singletons can be registered as dependencies": function(){
        var data = {
            method: false
        }
        
        mvc.dependencies.register.singleton('data_model', data);
        
        var target = {};
        mvc.dependencies.inject(target, ['data_model']);
        
        var second_target = {};
        mvc.dependencies.inject(second_target, ['data_model']);
        
        data.method = true;

        assertTrue(target.data_model.method);
        assertTrue(second_target.data_model.method);
    },
    
    "test singletons should be able to define their own dependencies": function(){
        var target = {},
            dependency = {
                foo: function(){}
            },
            second_dependency = {
                bar: function() {}
            };
            
        mvc.dependencies.register.singleton('dependency', dependency);
        mvc.dependencies.register.singleton('second', second_dependency, ['dependency']);
        mvc.dependencies.inject(target, ['second']);
        
        assertEquals(dependency, target.second.dependency);
    },
    
    "test that singleton init functions are called if present": function(){
        var target = {
            init: xray_specs.stub()
        }
        
        mvc.dependencies.register.singleton('target', target);
        
        assertTrue(target.init.called());
    }
});