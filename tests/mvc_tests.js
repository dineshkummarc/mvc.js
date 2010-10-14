TestCase("init", {
    setUp: function(){
        context = xray_specs.stub();
        
        xray_specs.mock(mvc, 'events', {
            register: {},
            dispatch: {}
        });
        
        mvc.create(context);
    },
    
    "test that a startup_complete signal is registered": function(){
        mvc.events.expects('register')
          .to_be_called.times(1)
            .with_args.including('startup_complete');
            
        assertTrue(mvc.events.verify());
    },
    
    "test that context function is called": function(){
        assertEquals(1, context.called_exactly(1));
    },
    
    "test that once context has been set up a startup_complete event is triggered": function(){
        mvc.events.expects('dispatch')
          .to_be_called.times(1)
            .with_args.including('startup_complete');
            
        assertTrue(mvc.events.verify());
    }
});
