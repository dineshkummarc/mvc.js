# Framework goals

The sole purpose of mvc.js is to provide a way for you to write modular applications - using an implementation of the [model-view-controler](http://en.wikipedia.org/wiki/Model%E2%80%93View%E2%80%93Controller) pattern and a [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection) container. There are already **many** libraries which provide animation, DOM manipulation, and ajax methods (amongst other things) and you are free to use your preferred library in conjunction with mvc.js.

Due to this single focus, mvc.js is extremely light-weight at just over **1kb when minified and gzipped**.

** Dependencies **

mvc.js depends on [underscore.js](http://documentcloud.github.com/underscore/), which is an extremely small library (2kb when gzipped) that offers a set of helper methods such as `each`, `map/reduce`, `clone`, etc.

# Getting started

This is a brief guide on how to use the framework. For more information on framework internals take a look at the [API reference](http://rlayte.github.com/mvc/) or the example applications:

+ [Hello world](http://rlayte.github.com/mvc/examples/hello_world/)
+ [Shopping cart](http://rlayte.github.com/mvc/examples/shopping_cart/)
+ Twitter client (coming soon)
+ Carousel (coming soon)
+ Video player (coming soon)

## Creating an application

To create an application with mvc.js you pass a function to the create method that defines the application objects and how they interact together. Within the function you have access to two objects: `dispatch` and `map`. Dispatch allows you to send events across the system, see the events documentation for more information. Map provides an API for registering models, views, and controllers. More details on how this is done can be found below.

Here's a simple example:

	mvc.create(function() {
		
		this.map.model('cart', (function() {
			
			var current_products;
			
			return {
				
				init: function() {
					// set up initial state
				},
				
				add_product: function(product) {
					// add product to current_products
				}
				
			}
			
		}));
		
		this.map.view($('.items'), {
			
			init: function() {
				// set up initial view state
			},
			
			disable: function() {
				// disable items
			}
			
		});
		
		this.map.controller('add_product', function(product) {
			// manipulate data and add it to the cart model
		});
		
		this.dispatch('add_initial_products');
		
	});
	
*Note: you can also map arbitrary values and objects using `map.instance` and `map.singleton`. These can be used to map common values (e.g. animation duration) and objects (e.g. product data object).*

## Models

Models are used to store data, process business logic, and maintain state.

To create a model in mvc.js you use the `map.model` method and pass it three parameters: `name`, `model`, and optionally `dependencies` (more on this below). The `name` parameter is a unique string id used to pull back references to the model. The second argument `model` is the actual object that is used to represent data.

This example registers a `cart` model and defines an API for setting and retrieving it's data.

	this.map.model('cart', (function() {
		
		var products = [];
		
		return {
			
			add_item: function(item) {
				products.push(item);
			},
			
			get_item: function(index) {
				return products[index];
			}
		}
		
	}));

** Init method **

You'll often need to set up initial state when models are registered. To do this you can define an `init` method on your model object which will be called immediately.

This example sets the same example as before, but adds a default product to the data store on creation.

	this.map.model('cart', (function() {
	
		var products = [];
	
		return {
		
			init: function() {
				products.push('Default item');
			},
		
			add_item: function(item) {
				products.push(item);
			},
		
			get_item: function(index) {
				return products[index];
			}
		}
	
	}));

** Dispatching events **

To maintain portability models should know as little about the surrounding system as possible. To achieve this models send events using `this.dispatch` when data is updated that other objects can react to.

This example dispatches a `product_added` event when the product data is updated. Note that the latest item is sent through as a parameter that can then be used by any listening functions.

	this.map.model('cart', (function() {
	
		var products = [];
	
		return {
		
			add_item: function(item) {
				products.push(item);
				
				this.dispatch('product_added', [item]);
			}
			
		}
	
	}));

## Views

Views are representations of the current state held by the application models. The most common representation will be an HTML element (or group of elements), but could also be the url bar, console, etc.

To register a view in mvc.js you call `map.view` and pass in the target element and a view object that defines an API for manipulating the element.

	this.map.view($('.product_list), (function() {
		
		return {
			display_products: function() {
				$(this.element).show();
			}
		}
	});
	
*Note: if an array of view elements is passed in as the first parameter (e.g. using a jQuery selector that selects all elements with a certain class) then a new view object will be created for each element.*

** Init method **

As with models you'll often need to define the initial state of views. This can be achieved in the same way by assigning an `init` method on your view object.

	this.map.view($('.product_list), (function() {
	
		return {
			init: function() {
				$(this.element).hide();
			},
			
			display_products: function() {
				$(this.element).show();
			}
		}
	});

** Handling events **

Views are less portable than the model layer because they have to react to specific events. To do this they must be able to register event listener, which can be achieved in to ways.

First, you can manually define event listeners by using the `events.listen` method, which requires an event type and callback as parameters. For example: 
	
	this.map.view($('.product_list), (function() {
		
		var handler = function() {
			
		}
	
		return {
			init: function() {
				$(this.element).hide();
				
				this.events.listen('product_added', handler);
			}
		}
	});
	
Alternatively, you can automatically create listeners by defining public methods on you view object. All methods (apart from init) will be registered as listeners using their name as the event type. For example the following view will react to `product_added` when dispatched.

	this.map.view($('.product_list), (function() {
		
		return {
			
			init: function() {
				$(this.element).hide();
			},
			
			product_added: function() {
				
			}
		}
	});

** Dispatching events **

Views can also dispatch events, generally to call required controllers. This is done by calling `events.dispatch` with a required event type and optionally any parameters to be used by the callback functions.

	this.map.view($('.product_list), (function() {
	
		return {
			
			init: function() {
				this.dispatch('view_created');
			}
			
		}
	});

** Defining dependencies **

mvc.js uses a form of dependency injection to define requirements between objects. This is done in views by creating a `dependencies` property on the view object, which contains an array of string references to registered objects. Each of these dependencies is then added on to the object so the view can interact with it as needed.

In this example a model is registered which a view then defines as a dependency and directly interacts with.

	this.map.model('cart', (function() {
	
		var products = [];
	
		return {
			add_item: function(item) {
				products.push(item);
			}
		}
	
	}));
	
	this.map.view($('.products'), (function() {
		
		return {
			dependencies: ['cart'],
			
			init: function() {
				this.cart.add_item('something');
			}
		}
	}));

## Controllers

Controllers are used to pass information between the model and view layers of you applications.

Controllers are defined in mvc.js by simply registering event listeners.

	this.map.controller('example', function(item) {
		// logic here
	});

** Mapping framework objects **

The context function that sets up applications is actually a controller and all controllers have access to the same API (i.e. map.model, map.view, dispatch, etc.). This means that controllers allow you to split up complex startup logic into manageable chunks and define new framework objects at run-time.

For example, this controller will register a new view when called:

	this.map.controller('add_item', function(item) {
		this.map.view(item, {
			check_stock: function() {}
		});
	});

** Defining dependencies **

In addition to this standard API you can also define additional dependencies by passing in an array of string IDs as a third parameter.

	this.map.controller('add_item', function(item) {
		this.cart.add_item(item);
	}, ['cart']);

# License

(The MIT License)

Copyright (c) 2010 Richard Layte

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.