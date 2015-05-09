var galleryControllers = angular.module('galleryControllers', []);

var test = {};

galleryControllers.controller('galleryController', ['$route', '$scope', '$location', '$http', '$templateCache', 'sharedProperties', function($route, $scope, $location, $http, sharedProperties, $templateCache){
    
	//Retrieve Jazz Collection JSON Data
        $scope.httpMethod = 'GET';
        $scope.dataUrl = 'collection.json';
        $scope.fetch = function()
        {
	   $scope.code = null;
	   $scope.response = null;

	    $http({method: $scope.httpMethod, url: $scope.dataUrl}).
	    success(function(data, status) {
		$scope.status = status;
		$scope.data = data;
		if($scope.data.collection)
		{
		    $scope.jazzPieces = $scope.data.collection;
		    sharedProperties.setProperty($scope.jazzPieces);
		    //alert(sharedProperties.getProperty().length);
		}
	    }).
	    error(function(data, status) {
		$scope.data = data || "Request failed";
		$scope.status = status;
	    });
	}
        

        //bound to checkboxes in list view
	$scope.filters = {
		genre_swing: true,
	        genre_ballad: true,
	        genre_funkRock: true,
	        genre_latin: true,
	        genre_bebop: true,
		sort_criteria: 2,
	};

	// Initializes and reinitializes the gallery array based on the filters
        $scope.init = function() {
	        $scope.fetch();
	        $scope.pathDecode();
	        $scope.change();
	};

	// called when the search criteria have changed
	$scope.change = function() {
		$location.path($scope.pathEncode());
		$('.piece').show(); //show all

		if(!$scope.filters.genre_swing) $('.genre_swing').hide();
		if(!$scope.filters.genre_ballad) $('.genre_ballad').hide();
		if(!$scope.filters.genre_funkRock) $('.genre_funkRock').hide();
	        if(!$scope.filters.genre_latin) $('.genre_latin').hide();
	        if(!$scope.filters.genre_bebop) $('.genre_bebop').hide();

	        if($scope.filters.genre_swing) $('.genre_swing').show();
		if($scope.filters.genre_ballad) $('.genre_ballad').show();
		if($scope.filters.genre_funkRock) $('.genre_funkRock').show();
	        if($scope.filters.genre_latin) $('.genre_latin').show();
	        if($scope.filters.genre_bebop) $('.genre_bebop').show();
				
	        if($scope.filters.sort_criteria == 0 || $scope.filters.sort_criteria == '0')
	        {
		    $scope.sort = 'title';
		}
	    
	        else if($scope.filters.sort_criteria == 1 || $scope.filters.sort_criteria == '1')
	        {
		    $scope.sort = 'genre';
	        }

	        else if($scope.filters.sort_criteria == 2 || $scope.filters.sort_criteria == '2')
	        {
		    $scope.sort = 'artist';
	        }


		$scope.total = $('.piece').length;
		$scope.showing = $('.piece:visible').length;

	};


	// Decodes the search string from the URL and sets the filters
	$scope.pathDecode = function() {
		$scope.search = $location.path().substr(1);

		var url_parts = $scope.search.split('-');
	   
	        if (url_parts.length < 6)
	        {
		    return;
		}

		$scope.filters.genre_swing = (url_parts[0] == '1');
		$scope.filters.genre_ballad = (url_parts[1] == '1');
	        $scope.filters.genre_funkRock = (url_parts[2] == '1');
	        $scope.filters.genre_latin = (url_parts[3] == '1');
		$scope.filters.genre_bebop = (url_parts[4] == '1');
		$scope.filters.sort_criteria = parseInt(url_parts[5]);
	};
								      
	// Turn filters into a string to put in the url
	$scope.pathEncode = function() {
		var path = '/';

		if ($scope.filters.genre_swing) path += '1-'; else path += '0-';
		if ($scope.filters.genre_ballad) path += '1-'; else path += '0-';
		if ($scope.filters.genre_funkRock) path += '1-'; else path += '0-';
	        if ($scope.filters.genre_latin) path += '1-'; else path += '0-';
	        if ($scope.filters.genre_bebop) path += '1-'; else path += '0-';
		path += $scope.filters.sort_criteria;

		return path;
	};

	//==================================================================
	// Sets the filters such that nothing is hidden
	$scope.showall = function() {
		$scope.filters.genre_swing = true;
		$scope.filters.genre_ballad = true;
		$scope.filters.genre_funkRock = true;
	        $scope.filters.genre_latin = true;
	        $scope.filters.genre_bebop = true;
		$scope.filters.sort_criteria = 2;
		$scope.change();
	};

}]);

galleryControllers.controller('pieceViewController', function($scope, $routeParams, sharedProperties) {
    $scope.viewid = $routeParams.viewid;
    $scope.jazzPieces = sharedProperties.getProperty();
    //alert($scope.jazzPieces.length);
    });

/*galleryControllers.controller('galleryViewController', ['$scope', '$routeParams', function($scope, $routeParams) {
    $scope.pathsettings = $routeParams.pathsettings;
    alert($scope.pathsettings);
    }]);
*/
