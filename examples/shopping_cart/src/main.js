require(['models/main', 'views/main', 'controllers/main'], function(models, views, controllers) {

    mvc({

        values: {
            cart_view: $('.cart'),
            items_view: $('.items')
        },
    
        models: models,
        views: views,
        controllers: controllers

    });

});
