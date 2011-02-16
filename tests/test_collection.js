TestCase('collections', {

    setUp: function() {
        collection = mvc.collections();
    },

    'test that mvc.collection is a function': function() {
        assertFunction(mvc.collections);
    },

    'test that it return an object with a create method': function() {
        assertFunction(collections.create);
    }

});
