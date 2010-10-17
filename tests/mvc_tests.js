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
            init: {}
        });
        
        xray_specs.mock(mvc, 'controllers', {
            init: {}
        });
        
        app = mvc.create(context);
    },
    tearDown: function() {
        mvc.events.reset();
        mvc.models.reset();
        mvc.views.reset();
        mvc.controllers.reset();
    },
    
    "test that context function is called": function(){
        assertEquals(1, context.called_exactly(1));
    },
    
    "test that the events object is initialised": function(){
        mvc.events.expects('init')
          .to_be_called.times(1);
          
        assertTrue(mvc.events.verify());
    },
    
    "test that once context has been set up a startup_complete event is triggered": function(){
        mvc.events.expects('dispatch')
          .to_be_called.times(1)
            .with_args.including('startup_complete');
            
        assertTrue(mvc.events.verify());
    },
    
    "test that models is initialised": function(){
        mvc.models.expects('init')
          .to_be_called.times(1)
            .with_args.matching(mvc.events.dispatch);
          
        assertTrue(mvc.models.verify());
    },
    
    "test that views is initialised": function(){
        mvc.views.expects('init')
          .to_be_called.times(1)
            .with_args.matching(mvc.events, mvc.models.get);
          
        assertTrue(mvc.views.verify());
    },
    
    "test that controllers is initialised": function(){
        mvc.controllers.expects('init')
          .to_be_called.times(1)
            .with_args.matching(mvc.events, mvc.models);
          
        assertTrue(mvc.controllers.verify());
    },
    
    "test that dispatch is available to the context function": function(){
        var dispatch;
        
        mvc.create(function() {
            dispatch = this.dispatch;
        });
        
        assertEquals(mvc.events.dispatch, dispatch);
    },
    
    "test that register_event is available to context": function(){
        var register_event;
        
        mvc.create(function() {
            register_event = this.register.controller;
        });
        
        assertEquals(mvc.controllers.register, register_event);
    },
    "test that register_model is available to context": function(){
        var register_model;
        
        mvc.create(function() {
            register_model = this.register.model;
        });
        
        assertEquals(mvc.models.register, register_model);
    },
    
    "test that register_view is available to context": function(){
        var register_view;
        
        mvc.create(function() {
            register_view = this.register.view;
        });
        
        assertEquals(mvc.views.register, register_view);
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
    }
    
});

TestCase("models", {
    setUp: function(){
        dispatch = xray_specs.stub();
        
        mvc.models.init(dispatch);
    },
    
    "test that models can be registered to a key/value store": function(){
        mvc.models.register('items', 'items_model');
          
        assertEquals('items_model', mvc.models.get('items'));
    },
    
    "test that an initialise function is called if present": function(){
        var init_stub = xray_specs.stub();
        
        mvc.models.register('items', {
            init: init_stub
        });
        
        assertTrue(init_stub.called());
    },
    
    "test that models are given a reference to dispatch": function(){    
        mvc.models.register('items', {
            register_item: function() {
                this.dispatch('item_registered');
            }
        });
        
        mvc.models.get('items').register_item();
        
        assertTrue(dispatch.called());
    },
    
    "test that models are not overriden": function(){
        mvc.models.register('items', 'first_model');
        mvc.models.register('items', 'this should not exist');
          
        assertEquals('first_model', mvc.models.get('items'));
    }
});

TestCase("views", {
    setUp: function(){
        /*:DOC +=
            <div id="jstd">
                <div class="list">
                    <h1>This is a list</h1>
                </div>
                
                <div class="list_two">
                    <h1>This is a list</h1>
                </div>
            </div>
        */
        
        xray_specs.mock(mvc, 'events', {
            dispatch: {},
            listen: {}
        });
        
        xray_specs.mock(mvc, 'models', {
            get: {}
        });
        
        mvc.views.init(mvc.events, mvc.models.get);
    },
    
    tearDown: function() {
        mvc.events.reset();
        mvc.models.reset();
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
    
    "test that views can retrieve models": function(){
        mvc.models.expects('get')
          .to_be_called.times(1)
            .with_args.matching('items');
            
        mvc.views.register($('.list'), {
            init: function() {
                this.models('items');
            }
        });
        
        assertTrue(mvc.models.verify());
    }
    
});

TestCase("controllers", {
    setUp: function(){
        xray_specs.mock(mvc, 'events', {
            dispatch: {},
            listen: {}
        });
        
        xray_specs.mock(mvc, 'models', {
            get: {}
        });
        
        mvc.controllers.init(mvc.events, mvc.models);
    },
    
    tearDown: function() {
        mvc.events.reset();
        mvc.models.reset();
    },
    
    "test that functions can be registered as controllers": function(){
        mvc.events.expects('listen')
          .with_args.including('item_added');
        
        mvc.controllers.register('item_added', function() {});
        
        assertTrue(mvc.events.verify());
    },
    
    "test that controllers have access to the model layer": function(){
        var controller = function() {};
        
        mvc.controllers.register('item_added', controller);
        
        assertEquals(mvc.models, controller.models);
    },
    
    "test that controller have access to the events bus": function(){
        var controller = function() {};
        
        mvc.controllers.register('item_added', controller);
        
        assertEquals(mvc.events, controller.events);
    }
});
