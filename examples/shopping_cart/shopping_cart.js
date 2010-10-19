// modulr (c) 2010 codespeaks sàrl
// Freely distributable under the terms of the MIT license.
// For details, see:
//   http://github.com/codespeaks/modulr/blob/master/LICENSE

var modulr = (function(global) {
  var _dependencyGraph = {},
      _loadingFactories = {},
      _incompleteFactories = {},
      _factories = {},
      _modules = {},
      _exports = {},
      _handlers = [],
      _dirStack = [''],
      PREFIX = '__module__', // Prefix identifiers to avoid issues in IE.
      RELATIVE_IDENTIFIER_PATTERN = /^\.\.?\//,
      _forEach,
      _indexOf;
      
  _forEach = (function() {
    var hasOwnProp = Object.prototype.hasOwnProperty,
        DONT_ENUM_PROPERTIES = [
          'constructor', 'toString', 'toLocaleString', 'valueOf',
          'hasOwnProperty','isPrototypeOf', 'propertyIsEnumerable'
        ],
        LENGTH = DONT_ENUM_PROPERTIES.length,
        DONT_ENUM_BUG = true;
    
    function _forEach(obj, callback) {
      for(var prop in obj) {
        if (hasOwnProp.call(obj, prop)) {
          callback(prop, obj[prop]);
        }
      }
    }
    
    for(var prop in { toString: true }) {
      DONT_ENUM_BUG = false
    }
    
    if (DONT_ENUM_BUG) {
      return function(obj, callback) {
         _forEach(obj, callback);
         for (var i = 0; i < LENGTH; i++) {
           var prop = DONT_ENUM_PROPERTIES[i];
           if (hasOwnProp.call(obj, prop)) {
             callback(prop, obj[prop]);
           }
         }
       }
    }
    
    return _forEach;
  })();
  
  _indexOf = (function() {
    var nativeIndexOf = Array.prototype.indexOf;
    if (typeof nativeIndexOf === 'function') {
      return function(array, item) {
        return nativeIndexOf.call(array, item);
      }
    }
    
    return function(array, item) {
      for (var i = 0, length = array.length; i < length; i++) {
        if (item === array[i]) { return i; }
      }
      return -1;
    }
  })();
  
  function require(identifier) {
    var fn, mod,
        id = resolveIdentifier(identifier),
        key = PREFIX + id,
        expts = _exports[key];
    
    if (!expts) {
      _exports[key] = expts = {};
      _modules[key] = mod = { id: id };
      
      fn = _factories[key];
      _dirStack.push(id.substring(0, id.lastIndexOf('/') + 1))
      try {
        if (!fn) { throw 'Can\'t find module "' + identifier + '".'; }
        if (typeof fn === 'string') {
          fn = new Function('require', 'exports', 'module', fn);
        }
        fn(require, expts, mod);
        _dirStack.pop();
      } catch(e) {
        _dirStack.pop();
        // We'd use a finally statement here if it wasn't for IE.
        throw e;
      }
    }
    return expts;
  }
  
  function resolveIdentifier(identifier) {
    var dir, parts, part, path;
    
    if (!RELATIVE_IDENTIFIER_PATTERN.test(identifier)) {
      return identifier;
    }
    dir = _dirStack[_dirStack.length - 1];
    parts = (dir + identifier).split('/');
    path = [];
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      switch (part) {
        case '':
        case '.':
          continue;
        case '..':
          path.pop();
          break;
        default:
          path.push(part);
      }
    }
    return path.join('/');
  }
  
  function define(descriptors, dependencies) {
    var missingDependencies;
    if (dependencies) {
      // Check to see if any of the required dependencies 
      // weren't previously loaded.
      // Build an array of missing dependencies with those which weren't.
      for (var i = 0, length = dependencies.length; i < length; i++) {
        var key = PREFIX + dependencies[i];
        if (!(key in _factories) && !(key in _incompleteFactories)) {
          missingDependencies = missingDependencies || [];
          missingDependencies.push(key);
        }
      }
    }
    
    if (missingDependencies) {
      // Add each newly defined descriptor to our list of
      // factories missing dependencies.
      // Build a dependency graph so we can handle subsequent 
      // require.define calls easily.
      _forEach(descriptors, function(id, factory) {
        var key = PREFIX + id;
        _dependencyGraph[key] = missingDependencies; // TODO clone?
        _incompleteFactories[key] = factory;
      });
      // load the missing modules.
      loadModules(missingDependencies);
    } else {
      // There aren't any missing dependencies in the factories
      // which were just defined. Lets move them to a list of
      // synchronously requirable factories.
      prepare(descriptors);
      // While we're at it, let's call all async handlers whose
      // dependencies are now available.
      callRipeHandlers();
    }
  }
  
  function prepare(descriptors) {
    // Handles factories for which all dependencies are
    // available.
    _forEach(descriptors, function(id, factory) {
      var key = PREFIX + id;
      // Move the factory from the list of factories missing
      // dependencies to the list of synchronously requirable
      // factories.
      _factories[key] = factory;
      delete _incompleteFactories[key];
      // Go through the dependency graph and remove the factory
      // from all of the missing dependencies lists.
      _forEach(_dependencyGraph, function(unused, dependencies) {
        var i = _indexOf(i, key);
        if (i > -1) { dependencies.splice(i, 1); }
      });
    });
    
    // Find all the factories which no longer have missing dependencies.
    var newFactories;
    _forEach(_dependencyGraph, function(key, dependencies) {
      if (dependencies.length === 0) {
        newFactories = newFactories || {};
        newFactories[key] = _incompleteFactories[key];
        delete _dependencyGraph[key];
      }
    });
    // recurse!
    if (newFactories) { prepare(newFactories); }
  }
  
  function ensure(dependencies, callback, errorCallback) {
    // Cache this new handler.
    _handlers.push({
      dependencies: dependencies,
      callback: callback,
      errorCallback: errorCallback
    });
    
    // Immediately callRipeHandlers(): you never know,
    // all of the required dependencies might be already
    // available.
    callRipeHandlers();
  }
  
  function callRipeHandlers() {
    var missingFactories;
    
    for (var i = 0, length = _handlers.length; i < length; i++) {
      // Go through all of the stored handlers.
      var handler = _handlers[i],
          dependencies = handler.dependencies,
          isRipe = true;
      for (var j = 0, reqLength = dependencies.length; j < reqLength; j++) {
        var id = dependencies[j];
        // If any dependency is missing, the handler isn't ready to be called.
        // Store those missing so we can later inform the loader.
        if (!_factories[PREFIX + id]) {
          missingFactories = missingFactories || [];
          if (_indexOf(missingFactories, id) < 0) {
            missingFactories.push(id);
          }
          isRipe = false;
        }
      }
      
      if (isRipe) {
        handler.callback(); // TODO error handling
      }
    }
    
    if (missingFactories) {
      loadModules(missingFactories);
    }
  }
  
  function loadModules(factories) {
    var missingFactories;
    for (var i = 0, length = factories.length; i < length; i++) {
      var factory = factories[i];
      if (!(factory in _loadingFactories)) {
        missingFactories = missingFactories || [];
        missingFactories.push(factory);
      }
    }
    if (missingFactories) {
      console.log(missingFactories);
    }
  }
  
  require.define = define;
  require.ensure = ensure;
  require.main = {};
  
  return {
    require: require
  };
})(this);

(function(require, module) {require.define({
'model/vo/product': function(require, exports, module) {
exports.product = (function() {
    
    return {
        name: 'No name defined',
        price: 0,
        quantity: 0
    }
    
})();
}, 
'model/cart': function(require, exports, module) {
exports.cart_model = (function() {
    
    var items;
    
    return {
        dependencies: ['shipping'],
        
        init: function() {
            items = {};
        },
        
        add_item: function(item) {
            if(items[item.name]) {
                items[item.name].quantity++;
            }
            else {
                items[item.name] = item;
            }
            
            this.dispatch('item_added', [item]);
        },
        
        get_total_price: function() {
            var price = 0;

            _.each(items, function(item) {
                price += (item.price * item.quantity);
            });
            
            price += this.shipping;
            
            return '£' + price.toString();
        }
    }
    
})();
}, 
'view/items': function(require, exports, module) {
exports.items_view = (function() {
    
    var that;
    
    return {
        init: function() {
            that = this;
            
            $(this.element).find('li').click(function() {
                that.events.dispatch('add_item', [this]);
            });
        }
    }
    
})();
}, 
'view/cart': function(require, exports, module) {
exports.cart_view = (function() {
    
    var that;
    
    return {
        dependencies: ['cart'],
        
        init: function() {
            that = this;
        },
        
        item_added: function(item) {
            $(this.element).find('ul').append('<li>' + item.name + '</li>').end()
                .find('.total_cost').html(this.cart.get_total_price());
        }
    }
    
})();
}, 
'controller/additem': function(require, exports, module) {
exports.add_item = function(item) {
    
    this.product.name = $(item).html();
    this.product.price = 12.99;
    this.product.quantity = 1;
    
    this.cart.add_item(this.product);
}
}
});
require.ensure(['model/vo/product', 'model/cart', 'view/items', 'view/cart', 'controller/additem'], function() {
var shopping_cart = mvc.create(function() {
    
    // Map values
    this.map.value('shipping', 5);
    
    // Map instances
    this.map.instance('product', require('model/vo/product').product);
    
    // Map models
    this.map.singleton('cart', require('model/cart').cart_model);
    
    // Map views
    this.map.view($('.items'), require('view/items').items_view);
    this.map.view($('.cart'), require('view/cart').cart_view);
    
    // Map controllers
    this.map.event('add_item', require('controller/additem').add_item, ['cart', 'product']);
    
});
});
})(modulr.require, modulr.require.main);
