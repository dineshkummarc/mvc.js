# Framework goals

The sole purpose of mvc.js is to provide a way for you to write modular applications - using an implementation of the [model-view-controler](http://en.wikipedia.org/wiki/Model%E2%80%93View%E2%80%93Controller) pattern and a [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection) container. There are already **many** frameworks which provide animation, DOM manipulation, and ajax methods (amongst other things) and you are free to use your preferred framework in conjunction with mvc.js.

Due to this single focus, mvc.js is extremely light-weight at just over **1kb when minified and gzipped**.

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

** Init method **

** Handling events **

** Defining dependencies **

## Controllers

Controllers are used to pass information between the views and models

** Mapping system objects **

** Defining dependencies **

