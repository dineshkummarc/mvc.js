TestCase('update message', {

    setUp: function() {
        /*:DOC form = 
             <div id="update_form">
                <input type="text" name="message" id="message" />
                <input type="button" name="update" id="update" value="Update" />
             </div>
         */

        view = hello_world.views.update_form;

        view.element = $(this.form);

        xray_specs.mock(view, 'status', {
            update: {}
        });

        view.init();
    },

    tearDown: function() {
        view.status.reset();
    },

    'test that clicking on the update button calls hello_world.models.status update method': function() {
        view.status.expects('update');

        view.element.find('#message').val('Hello world');
        view.element.find('#update').click();

        assertTrue(view.status.verify());
    }

});
