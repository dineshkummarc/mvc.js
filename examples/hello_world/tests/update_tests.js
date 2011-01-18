TestCase('updated status view', {

    setUp: function() {
        /*:DOC status_dom = 
             <div id="status">
                <h1></h1>
             </div>
         */
               
        status_view = hello_world.views.status;

        status_view.status_element = $(this.status_dom);
    },

    tearDown: function() {

    },

    'test that view has a status_updated method': function() {
        assertFunction(status_view.status_updated);
    },

    'test that h1 tag has status appended': function() {
        status_view.status_updated('Hello world');

        assertEquals('Hello world', status_view.status_element.find('h1').html());
    }

});
