TestCase('add item view', {

    'setUp': function() {
        view = todo_list.views.items;

        /*:DOC add_item = <div><a href="#">Add</a></div>*/

        xray_specs.mock(view, 'list', {
            add: {}
        });
    },

    'tearDown': function() {
        view.list.reset();
    },

    'test that models.list.add is called when form is submitted': function() {
        view.list.expects('add');

        assertTrue(view.list.verify());
    }

});
