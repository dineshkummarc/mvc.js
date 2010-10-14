TestCase("init", {
    setUp: function(){
        context = xray_specs.stub();
        
        mvc.create(context);
    },
    
    "test that context function is called": function(){
        assertEquals(1, context.called_exactly(1));
    }
});
