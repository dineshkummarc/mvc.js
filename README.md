# Framework goals

The sole purpose of mvc.js is to provide a way for you to write modular applications - using an implementation of the [model-view-controler](http://en.wikipedia.org/wiki/Model%E2%80%93View%E2%80%93Controller) pattern and a [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection) container. There are already **many** libraries which provide animation, DOM manipulation, and ajax methods (amongst other things) and you are free to use your preferred library in conjunction with mvc.js.

Due to this single focus, mvc.js is extremely light-weight at just over **1kb when minified and gzipped**.

** Dependencies **

mvc.js depends on [underscore.js](http://documentcloud.github.com/underscore/), which is an extremely small library (2kb when gzipped) that offers a set of helper methods such as `each`, `map/reduce`, `clone`, etc.

# Getting started

This is a brief guide on how to use the framework. For more information on framework internals take a look at the [API reference](http://rlayte.github.com/mvc.js/docs/output/) or the example applications:

+ [Hello world](http://rlayte.github.com/mvc.js/examples/hello_world/)
+ [Shopping cart](http://rlayte.github.com/mvc.js/examples/shopping_cart/)
+ [Carousel](http://rlayte.github.com/mvc.js/examples/carousel/)
+ [Todo list](http://rlayte.github.com/mvc.js/examples/todo_list/)

## Creating an application

To create an application with mvc.js you pass an object that defines the models, views, and controllers (see below for details on how this works). 

Here's a simple example:

	mvc.create({

        config: {
            items_view: $('.items')
        },
        
		models: {

			cart: {
                init: function() {
                    // set up initial state
                },
                
                add_product: function(product) {
                    // add product to current_products
                }
            }
			
		},

        views: {
            
            items: {

                items_view: '__inject__',
                cart: '__inject__',

                init: function() {
                    this.cart.add_products();
                },
                
                disable: function() {
                    $(this.items_view).find('.items').hide();
                }
            }

        },

        controllers: {

            setup_items: {
                cart: '__inject__',
                command: function() {
                    this.cart.add_product();
                }
            }            
        }
		
	});

## Models

Models are used to store data, process business logic, and maintain state.

To create models in mvc.js you define a collection of models in the config object passed to the create function. Each model is registered as a dependency based on it's key and should define a public API to manipulate it's data.

This example registers a `cart` model and defines an API for setting and retrieving it's data.

	mvc({
		
        models: {

            cart: (function(){

                var products = [];

                return {

                    add_item: function(item) {
                        products.push(item);
                    },
                    
                    get_item: function(index) {
                        return products[index];
                    }

                }

            })()

        }

    });

** Init method **

You'll often need to set up initial state when models are registered. To do this you can define an `init` method on your model, which will be called immediately.

This example sets the same example as before, but adds a default product to the data store on creation.

	mvc({
		
        models: {

            cart: (function(){

                var products = [];

                return {

                    init: function() {
                        products.push('Some item');
                    },

                    add_item: function(item) {
                        products.push(item);
                    },
                    
                    get_item: function(index) {
                        return products[index];
                    }

                }

            })()
        }

    });

** Dispatching events **

To maintain portability models should know as little about the surrounding system as possible. To achieve this models send events using `this.dispatch` when data is updated that other objects can react to.

This example dispatches a `product_added` event when the product data is updated. Note that the latest item is sent through as a parameter that can then be used by any listening functions.

	mvc({
		
        models: {

            cart: (function(){

                var products = [];

                return {

                    add_item: function(item) {
                        products.push(item);
                        this.dispatch('product_added', [item]);
                    },

                }

            })()
        }

    });

## Views

Views are representations of the current state held by the application models. The most common representation will be an HTML element (or group of elements), but could also be the url bar, console, etc.

To register a view in mvc.js you call the create method with a collection of views, each defines a public API which inteprets information from the application and updates the system when neccesary. Optionally external dependencies can be defined.

    mvc({

        views: {

            'items': {

                display_products: function() {
                    $(this.element).show();
                }

            }

        }

    });

** Init method **

As with models you'll often need to define the initial state of views. This can be achieved in the same way by assigning an `init` method on your view object.

    mvc({

        views: {

            'items': {
                init: function() {
                    // set up initial state
                }

                display_products: function() {
                    this.element.show();
                }
            }

        }

    });

** Handling events **

Views are less portable than the model layer because they have to react to specific events. To do this they must be able to register event listeners, which can be achieved in two ways.

First, you can manually define event listeners by using the `listen` method, which requires an event type and callback as parameters. For example: 
	
    mvc({

        views: {

            'items': (function() {

                var handler = function() {
                    $(this.element).show();
                }

                return {

                    init: function() {
                        $(this.element).hide();
                        
                        this.listen('product_added', handler);
                    }

                }

            })()

        }

    });
	
Alternatively, you can automatically create listeners by defining public methods on your view object. All methods (apart from init) will be registered as listeners using their name as the event type. For example the following view will react to `product_added` event when dispatched.
    
    mvc({

        views: {

            'items': (function() {

                return {
                    init: function() {
                        $(this.element).hide();
                    },

                    product_added: function() {
                        $(this.element).show();
                    }

                }

            })()

        }

    });

** Dispatching events **

Views can also dispatch events, generally to trigger required controllers. This is done by calling `events.dispatch` with a required event type and optionally any parameters to be used by the callback functions.

    mvc({

        views: {

            'items': {

                init: function() {
                    this.dispatch('add_products');
                }

            }

        }

    });

** Defining dependencies **

mvc.js uses a form of dependency injection to define requirements between objects. This is done by defining properties on the view object with a string value of `__inject__`. Each of these dependencies are then replaced by the required objects if an object has been registered with the same key.

In this example a model is registered, which a view then defines as a dependency and directly interacts with.

    mvc({

        models: {

            cart: {
                add_item: function() {}
            }
        
        },

        views: {

            'items': {

                cart: '__inject__',

                init: function() {
                    this.cart.add_item('some product');
                }

            }

        }

    });

## Controllers

Controllers are used to pass information between the model and view layers of you applications.
 
Controllers are defined in mvc.js by passing a collection of controllers, which define a command function and optionally any required dependencies. The commands are simply registered as event listeners using the object key as the event string.

    mvc({

        controllers: {

            'remove_all_products': {
                command: function() {}
            }

        }

    });

** Defining dependencies **

You can additionally define dependencies by defining '__inject__' strings for the requireed objects.

    mvc({

        controllers: {

            'remove_all_products': {
                cart: '__inject__',
                command: function() {
                    this.cart.remove_product();
                }
            }

        }

    });

## Values

You can also map simple values as dependencies, which can be used to alter the behaviour of models, views, and controllers. For example, if a shipping charge needs to be added to orders you could define it in the following way.

    mvc({

        config: {
            shipping: 5
        },

        models: {
            cart: (function() {

                var total, sub_total = 0;

                return {

                    shipping: '__inject__',
                    
                    add_item: function(item) {
                        sub_total += item.price;
                        total = sub_total + this.shipping;
                    }

                };

            })()
        }

    });

The advantage of this is that it provides a simple way to configure applications without making changes to the internal code.

## Exports

At times it may be neccesary for other applications or arbitrary scripts to interact with your application. This is acheived by defining an `exports` object which returns a public API to the calling object. For example

    var store = mvc({

        ...

        exports: {
        
            add_product: function() {}
            remove_product: function() {}

        }

    });

    store.add_product('t shirt');

To keep your application encapsulated the external functions cannot directly access models or views, but are able to dispatch and listen for events. To make a change within the system you can dispatch an event which will trigger an internal listener to carry out the required task.

    var store = mvc({

        models {

            cart: {
                add_item: function() {}
            }

        },

        controllers: {

            add_product: {
                cart: '__inject__',
                command: function(product) {
                    this.cart.add_item(product);
                }
            }

        }, 

        exports: {
        
            add_product: function() {
                this.dispatch('add_product');
            }

        }

    });

    store.add_product('t shirt');

Export functions also have access to events.listen and can therefore define external event listeners. For example, if you want to update something outside of the application everytime a product is successfully added to the cart you could do the following:
    
    var store = mvc({

        models: {

            cart: {
                add_item: function() {
                    this.dispatch('product_added');
                }
            }

        },

        exports: {
        
            on_product_added: function(callback) {
                this.listen('product_added', callback);
            }

        }

    });

    store.on_product_added(function() {
        $('.something').show();
    });
    
## Imports - creating modular applications

It is also possible to import applications into other applications by defining an `imports` object when the mvc function is called. This allows you to build modular, fully-formed apps that can then be plugged together as required. For example, in the above shopping cart code could be broken down into a `cart` app and an `item_list` app, which are then pulled together by a `store` app. The advantage of this is that as long as the API remains consistent the `cart` application could be replaced or reused somewhere else without out affecting any other parts of the sytem. It also allows for these parts of a larger application to be developed completely idependently - as long as an API is agreed upon the modules can be plugged together without a problem.

Consider this example:

    var cart = mvc({
        
        models: {
            ...
        },

        views: {
            ...
        },

        controllers: {
            ...
        },

        exports: {
            add_item: function(item) {
                this.dispatch('add', [item]);
            },

            remove_item: function(item) {
                this.dispatch('remove', [item]);
            }
        }
    });

This is a full application, but instead of using it by itself we are going to implemented it as a component of a larger app. See above for examples on how the models, views, and controllers for this example could be implemented. 

The important point is the exports API because that defines how other applications can interact with it. The `cart` application defines two methods that can add and remove products from the cart's model.

    var item_list = mvc({
        
        models: {
            ...
        },

        views: {
            ...
        },

        controllers: {
            ...
        },

        exports: {
            on_select: function(callback) {
                this.listen('item_selected', callback);
            }
        }
    });

Again this is a full application. The exported API for `item_list` defines a method that acts as an event listener for products being added. For example, when a product image is clicked an event will be dispatched which will then call this method.

    var store = mvc({

        imports: {
            'cart': cart',
            'items': item_list
        },
        
        models: {
            ...
        },

        views: {

            products: {
                items: '__inject__',
                cart: '__inject__',

                init: function() {
                    var that = this;

                    this.items.on_select(function(item) {
                        that.cart.add_item(item);
                    });
                }
            }

        },

        controllers: {
            ...
        }

    });

This final applications brings the previous two together and links selections made in `item_list` to the `add_item` method of `cart`.

In this trivial example it may not be clear why you would want to break applications down into speperate modules. However, as projects grow having the ability to work on different areas seperately allows for better workflow between developers, an easier mechanism for replacing components, and more realistic code reuse.


# License

(The MIT License)

Copyright (c) 2010 Richard Layte

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
