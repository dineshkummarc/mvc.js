TestCase('collections', {

    setUp: function() {
        collection = mvc.collections();
    },

    'test that mvc.collection is a function': function() {
        assertFunction(mvc.collections);
    },

    'test that it return an object with a create method': function() {
        assertFunction(collection.create);
    },

    'test that create returns an object when a constructor function is passed in': function() {
        c = collection.create(function() {});
        
        assertFunction(c.add);
    },

    'test that an exception is thrown if a function is not passed in': function() {
        assertException(function() {
            c = collection.create();
        });
    },

    'test that add creates a new model and adds it to the collection': function() {
        User = function() {
            this.name = 'Rich';
            this.age = 28;
        };

        users = collection.create(User);

        users.add();
        all_users = users.all();

        assertEquals('Rich', all_users[0].name);
        assertEquals(28, all_users[0].age);
    },

    'test that add passes on the corect parameters to the constructor': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 28);
        all_users = users.all();

        assertEquals('Rich', all_users[0].name);
        assertEquals(28, all_users[0].age);
    },

    'test that all() returns an array of all added objects': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 28);
        users.add('Bill', 38);
        all_users = users.all();

        assertEquals('Bill', all_users[1].name);
        assertEquals(38, all_users[1].age);
    },

    'test that get() returns the users with matching parameters': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 28);
        users.add('Bill', 38);
        users.add('Geoff', 34);

        rich = users.get({name: 'Rich'});

        assertEquals(1, rich.length);
        assertEquals('Rich', rich[0].name);
        assertEquals(28, rich[0].age);
    },

    'test that all matching models are returned from a get() call': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 28);
        users.add('Bill', 28);
        users.add('Geoff', 34);

        same_age = users.get({age: 28});

        assertEquals(2, same_age.length);
        assertEquals('Rich', same_age[0].name);
        assertEquals(28, same_age[0].age);
        assertEquals('Bill', same_age[1].name);
        assertEquals(28, same_age[1].age);
    },

    'test that mutliple filters can be applied': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 28);
        users.add('Bill', 28);
        users.add('Geoff', 34);

        same_age = users.get({name: 'Rich', age: 28});

        assertEquals(1, same_age.length);
        assertEquals('Rich', same_age[0].name);
        assertEquals(28, same_age[0].age);
    },

    'test that models can be deleted': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 28);
        users.add('Bill', 28);
        users.add('Rich', 30);
        users.add('Geoff', 34);

        users.remove({name: 'Rich', age: 28});

        all = users.all();

        assertEquals(3, all.length);
        assertEquals('Bill', all[0].name);
        assertEquals(28, all[0].age);
    },

    'test that models can be deleted by passing instances': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 28);
        users.add('Bill', 28);
        users.add('Geoff', 34);

        rich = users.get({name: 'Rich'});
        users.remove(rich[0]);

        all = users.all();

        assertEquals(2, all.length);
        assertEquals('Bill', all[0].name);
        assertEquals(28, all[0].age);
    },

    'test that returned array can be limited': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 28);
        users.add('Rich', 28);
        users.add('Rich', 28);
        users.add('Rich', 28);
        users.add('Bill', 28);
        users.add('Geoff', 34);

        all = users.all().first(3);

        assertEquals(3, all.length);
        assertEquals('Rich', all[0].name);
        assertEquals('Rich', all[1].name);
        assertEquals('Rich', all[2].name);
    },

    'test that the last number of items can be filtered': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 28);
        users.add('Rich', 28);
        users.add('Rich', 28);
        users.add('Rich', 28);
        users.add('Bill', 28);
        users.add('Geoff', 34);

        all = users.all().last(3);

        assertEquals(3, all.length);
        assertEquals('Rich', all[0].name);
        assertEquals('Bill', all[1].name);
        assertEquals('Geoff', all[2].name);
    },

    'test that the first number of items can be filtered on pre-filtered lists': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 18);
        users.add('Rich', 28);
        users.add('Rich', 38);
        users.add('Rich', 48);
        users.add('Bill', 28);
        users.add('Geoff', 34);

        all = users.get({name: 'Rich'}).first(3);

        assertEquals(3, all.length);
        assertEquals('Rich', all[0].name);
        assertEquals('Rich', all[1].name);
        assertEquals('Rich', all[2].name);
    },

    'test that the last number of items can be filtered on pre-filtered lists': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 18);
        users.add('Rich', 28);
        users.add('Rich', 38);
        users.add('Rich', 48);
        users.add('Bill', 28);
        users.add('Geoff', 34);

        all = users.get({name: 'Rich'}).last(3);

        assertEquals(3, all.length);
        assertEquals('Rich', all[0].name);
        assertEquals('Rich', all[1].name);
        assertEquals('Rich', all[2].name);
    },

    'test that the first item is returned as an object': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 18);
        users.add('Rich', 28);
        users.add('Rich', 38);
        users.add('Rich', 48);
        users.add('Bill', 28);
        users.add('Geoff', 34);

        young_me = users.get_first({name: 'Rich'});

        assertEquals(18, young_me.age);
    },

    'test that the last item is returned as an object': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 18);
        users.add('Rich', 28);
        users.add('Rich', 38);
        users.add('Rich', 48);
        users.add('Bill', 28);
        users.add('Geoff', 34);

        old_me = users.get_last({name: 'Rich'});

        assertEquals(48, old_me.age);
    },

    'test that you can order items by strings': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 18);
        users.add('Rich', 38);
        users.add('Rich', 48);
        users.add('Bill', 28);
        users.add('Geoff', 34);

        by_name = users.all({name: 'Rich'}).order_by('name');

        assertEquals('Bill', by_name[0].name);
        assertEquals('Geoff', by_name[1].name);
        assertEquals('Rich', by_name[2].name);
    },

    'test that you can order items by number': function() {
        User = function(name, age) {
            this.name = name;
            this.age = age;
        };

        users = collection.create(User);

        users.add('Rich', 18);
        users.add('Rich', 38);
        users.add('Rich', 48);
        users.add('Bill', 28);
        users.add('Geoff', 34);

        all = users.all({name: 'Rich'}).order_by('age');

        assertEquals('Rich', all[0].name);
        assertEquals('Bill', all[1].name);
        assertEquals('Geoff', all[2].name);
    },

    'test that you can order items by date': function() {
        User = function(name, age, date) {
            this.name = name;
            this.age = age;
            this.date = new Date(date);
        };

        users = collection.create(User);

        users.add('Rich', 18, "March 12, 2014");
        users.add('Rich', 38, "March 12, 2013");
        users.add('Rich', 48, "March 12, 2012");
        users.add('Bill', 28, "March 12, 2011");
        users.add('Geoff', 34, "March 12, 2010");

        all = users.all().order_by('date');

        assertEquals('Geoff', all[0].name);
        assertEquals('Bill', all[1].name);
        assertEquals('Rich', all[2].name);
    }

});
