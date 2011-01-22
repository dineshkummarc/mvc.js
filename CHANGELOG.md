# mvc.js changelog

## 22/01/2011 - v0.0.8
+ Added optional inject parameters to allow for more flexible naming.
+ Added package.json for npm installation
+ Removed cucumber features from framework tests, added to specific examples.

## 17/01/2011 - v0.0.7

+ Refactored require API to automatically inject variables marked with '__inject__' string.
+ Removed mediator nested objects from views to work on view objects directly.
+ Removed facade nested object from models to work on model objects directly.

## 11/12/2010 - v0.0.6

+ Added initial plugin feature
+ Refactored framework objects to return register functions

## 04/12/2010 - v0.0.5

+ Added `values` to config API
+ Replaced existing functional tests with cucumber features
+ Added tests to deploy task in rake build
+ Additional inline docs
+ Starting at v0.0.5
