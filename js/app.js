var app = angular.module('jazzGalleryApp', [
    'ngRoute',
    'galleryControllers'
]);

app.service('sharedProperties', function() {
    var jazzPieces = {};
    var currentURL = "";
    
    this.storePieces = function (dataCollection)
    {
	jazzPieces.data = dataCollection;
    }
    
    this.retrievePieces = function ()
    {
	return jazzPieces;
    };

    this.storeCurrentURL = function (_currentURL)
    {
	currentURL = _currentURL;
	//Save currentURL to storage
	this.saveToStorage("lastVisitedPage", currentURL);
    }

    this.retrieveCurrentURL = function ()
    {
	return currentURL;
    }

    this.saveToStorage = function (key, value)
    {
	localStorage.setItem(key, value);
    }
});

app.directive('onLastRepeat', function() {
    return function(scope, element, attrs) {
	if (scope.$last) setTimeout(function(){
	    scope.$emit('onRepeatLast',element,attrs);
	}, 3);
    };
});


//ROUTING ================================================
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
	
	.when('/', {
	    templateUrl: 'blank.html',
	    controller : 'galleryController'
	})
        .when('/views/:viewid', {
	    templateUrl: 'piece-detail.html',
	    controller : 'pieceViewController'
	});
}]);

