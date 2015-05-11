window.onload = function()
{
    if(typeof(Storage) !== "undefined")
    {
	//Retrieve preferences from local storage
	var lastVisitedPage = localStorage.getItem("lastVisitedPage");
	
	//Set location to last visited page
	if(lastVisitedPage !== undefined)
	{
	    window.location.href = preferences.lastVisitedPage;
	}
    }

    else
    {
	//Local storage not supported in this browser
    }
}
   


var app = angular.module('jazzGalleryApp', [
    'ngRoute',
    'galleryControllers'
]);

app.service('sharedProperties', function() {
    var jazzPieces = {};

    this.storePieces = function (dataCollection)
    {
	jazzPieces.data = dataCollection;
    }
    
    this.retrievePieces = function ()
    {
	return jazzPieces;
    };
});

app.directive('onLastRepeat', function() {
    return function(scope, element, attrs) {
	if (scope.$last) setTimeout(function(){
	    scope.$emit('onRepeatLast',element,attrs);
	}, 3);
    };
});


//ROUTING ================================================
app.config(['$routeProvider',
	    function($routeProvider) {
    $routeProvider
	
	.when('/', {
	    templateUrl: 'gallery.html',
	    controller : 'galleryViewController'
	})
        .when('/views/:viewid', {
	    templateUrl: 'piece-detail.html',
	    controller : 'pieceViewController'
	});
	    }]);

