var carousel = mvc.create(function() {
	
	// map models
	this.map.model('items', require('model/items').items_model);

	// map views
	this.map.view($('.panels'), require('view/panels').panels_view);
	this.map.view($('.controls'), require('view/controls').controls_view);
	
	// map controllers
	this.map.controller('auto_select', require('controller/autoselect').auto_select, ['items']);

	// dispatch events to initialise
	this.dispatch('auto_select', [5000]);
});

