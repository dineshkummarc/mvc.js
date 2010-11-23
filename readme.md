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
+ Twitter client (coming soon)
+ Video player (coming soon)

## Creating an application

To create an application with mvc.js you pass an object that defines the models, views, and controllers (see below for details on how this works). 

Here's a simple example:

	mvc.create({
        
		models: {

			cart: {
                
                proxy: {
                    init: function() {
                        // set up initial state
                    },
                    
                    add_product: function(product) {
                        // add product to current_products
                    }
                }
				
			}
			
		},

        views: {
            
            items: {

                element: $('.items'),
                requires: ['cart'],
                mediator: { 
                    init: function() {
                        this.cart.add_products();
                    },
                    
                    disable: function() {
                        $(this.element).find('.items').hide();
                    }
                }

            }

        },

        controllers: {

            setup_items: {
                requires: ['cart'],
                command: function() {
                    this.cart.add_product();
                }
            }            
        }
		
	});

## Models

Models are used to store data, process business logic, and maintain state.

To create models in mvc.js you define a collection of models in the config object passed to the create function. Each model is registered as a dependency based on it's key and should have define a proxy object, which defines a public API.

This example registers a `cart` model and defines an API for setting and retrieving it's data.

	mvc({
		
        models: {

            cart: {
                proxy: (function(){

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

        }

    });

** Init method **

You'll often need to set up initial state when models are registered. To do this you can define an `init` method on your model object which will be called immediately.

This example sets the same example as before, but adds a default product to the data store on creation.

	mvc({
		
        models: {

            cart: {
                proxy: (function(){

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

        }

    });

** Dispatching events **

To maintain portability models should know as little about the surrounding system as possible. To achieve this models send events using `this.dispatch` when data is updated that other objects can react to.

This example dispatches a `product_added` event when the product data is updated. Note that the latest item is sent through as a parameter that can then be used by any listening functions.

	mvc({
		
        models: {

            cart: {
                proxy: (function(){

                    var products = [];

                    return {

                        add_item: function(item) {
                            products.push(item);
                            this.dispatch('product_added', [item]);
                        },

                    }

                })()
            }

        }

    });

## Views

Views are representations of the current state held by the application models. The most common representation will be an HTML element (or group of elements), but could also be the url bar, console, etc.

To register a view in mvc.js you call the create method with a collection of views, each defines a mediator object which define a public API. Optionally a view element and external dependencies can be defined.

    mvc({

        views: {

            'items': {

                element: $('.items'),
                mediator: {

                    display_products: function() {

                        $(this.element).show();

                    }
                }
            }

        }

    });

** Init method **

As with models you'll often need to define the initial state of views. This can be achieved in the same way by assigning an `init` method on your mediator object.

    mvc({

        views: {

            'items': {

                element: $('.items'),
                mediator: {

                    init: function() {
                        // set up initial state
                    }

                    display_products: function() {

                        $(this.element).show();

                    }
                }
            }

        }

    });

** Handling events **

Views are less portable than the model layer because they have to react to specific events. To do this they must be able to register event listener, which can be achieved in to ways.

First, you can manually define event listeners by using the `listen` method, which requires an event type and callback as parameters. For example: 
	
    mvc({

        views: {

            'items': {

                element: $('.items'),
                mediator: (function() {

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

        }

    });
	
Alternatively, you can automatically create listeners by defining public methods on your mediator object. All methods (apart from init) will be registered as listeners using their name as the event type. For example the following view will react to `product_added` when dispatched.
    
    mvc({

        views: {

            'items': {

                element: $('.items'),
                mediator: (function() {

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

        }

    });

** Dispatching events **

Views can also dispatch events, generally to call required controllers. This is done by calling `events.dispatch` with a required event type and optionally any parameters to be used by the callback functions.

    mvc({

        views: {

            'items': {

                element: $('.items'),
                mediator: (function() {

                    return {
                        init: function() {
                            this.dispatch('add_products');
                        }

                    }

                })()
            }

        }

    });

** Defining dependencies **

mvc.js uses a form of dependency injection to define requirements between objects. This is done in views by creating a requirements property on the view object, which contains an array of string references to registered objects. Each of these dependencies is then added on to the mediator object so the you can interact with it as needed.

In this example a model is registered which a view then defines as a dependency and directly interacts with.

    mvc({

        models: {

            cart: {
                proxy: {

                    add_item: function() {}

                }
            }
        
        },

        views: {

            'items': {

                element: $('.items'),
                requires: ['cart'],
                mediator: (function() {

                    return {
                        init: function() {
                            this.cart.add_item('some product');
                        }

                    }

                })()
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

You can additionally define dependencies by passing in an array of string IDs as the requires property of the controller.

    mvc({

        controllers: {

            'remove_all_products': {
                requires: ['cart']
                command: function() {
                    this.cart.remove_product();
                }
            }

        }

    });

# License

(The MIT License)

Copyright (c) 2010 Richard Layte

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
