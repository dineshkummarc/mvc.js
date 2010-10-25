# Framework goals

The sole purpose of mvc.js is to provide a way for you to write modular applications - using an implementation of the model-view-controler pattern and a dependency injection container. There are already **many** frameworks which provide animation, DOM manipulation, and ajax methods (amongst other things) and you are free to use your preferred framework in conjunction with mvc.js.

Due to this single focus, mvc.js is extremely light-weight weighing in at under 1kb when minified and gzipped.

# Getting started

This is a brief guide to best-practices and how to use the framework. For full a full API reference see the [documentation](http://rlayte.github.com/mvc/) or take a look through the example applications:

+ [Hello world](#)
+ [Shopping cart](#)
+ Twitter client (coming soon)
+ Carousel (coming soon)
+ Video player (coming soon)

## Creating an application

To create an application with mvc.js you pass a function to the create method that defines the application objects and how they interact together. Within the function you have access to two objects: dispatch and map. Dispatch allows you to send events across the system, see the events documentation for more information. Map provides an api for registering models, views, and controllers. More details on how this is done can be found below.

Here's a simple example:

	mvc.create(function() {
		
		map.model('cart', (function() {
			
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
		
		map.view($('.items'), {
			
			init: function() {
				// set up initial view state
			},
			
			disable: function() {
				// disable items
			}
			
		});
		
		map.controller('add_product', function(product) {
			// manipulate data and add it to the cart model
		});
		
		this.dispatch('add_initial_products');
		
	});

## Models

## Views

## Controllers

## Dependency Injection

