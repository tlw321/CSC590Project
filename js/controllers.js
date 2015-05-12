var galleryControllers = angular.module('galleryControllers', []);
var test = {};

galleryControllers.controller('galleryController', ['$route', '$scope', '$location', '$http', '$timeout', 'sharedProperties', '$templateCache', function($route, $scope, $location, $http, $timeout, sharedProperties, $templateCache){
    
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
		    sharedProperties.storePieces($scope.jazzPieces);
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

        $scope.init = function() {
	    $scope.fetch();
	    $scope.getStorage();
	    $scope.initUrl();
	    $scope.pathDecode();
	};

    $scope.$on('onRepeatLast', function(scope, element, attrs){
	$scope.updateGalleryControls();
    });

    $scope.isShowing = function() {
	if(!$scope.filters.genre_bebop && !$scope.filters.genre_latin && !$scope.filters.genre_swing && !$scope.filters.genre_ballad && !$scope.filters.genre_funkRock)
	    {
		$scope.showing = false;
		return false;
	    }

	    else
	    {
		$scope.showing = true;
		return true;
	    }
    }

    $scope.getStorage = function()
    {
	if(localStorage.getItem("lastVisitedPage") !== undefined)
	{
	    $scope.lastVisitedPage = localStorage.getItem("lastVisitedPage");
	    //Set checkbox state if last visited page is a view page
	    if($scope.isViewPath($scope.lastVisitedPage))
	    {
		$scope.filters.genre_swing = localStorage.getItem("genre_swing_state");
		$scope.filters.genre_ballad = localStorage.getItem("genre_ballad_state");
		$scope.filters.genre_funkRock = localStorage.getItem("genre_funkRock_state");
		$scope.filters.genre_latin = localStorage.getItem("genre_latin_state");
		$scope.filters.genre_bebop = localStorage.getItem("genre_bebop_state");
	    }

	    $scope.filters.sort_criteria = localStorage.getItem("sort_criteria");
	}

	else
	{
	    $scope.lastVisitedPage = "";
	}
    }

    $scope.isViewPath = function(string)
    {
	return string.substr(1,5)=="views";
    }
    
    $scope.initUrl = function()
    {
	if($scope.lastVisitedPage != "")
	{
	    $location.path($scope.lastVisitedPage);
	    $scope.updateGalleryControls();
	}

	else
	{
	    $scope.change();
	}
    }
    
    $scope.setStorage = function()
    {
	
	if($location.path().substr(1,5)!="views")
	{
	    $scope.lastVisitedPage = $location.path();
	    localStorage.setItem("lastVisitedPage", $scope.lastVisitedPage);
	}
	
	//Save genre state
	localStorage.setItem("genre_swing_state", $scope.filters.genre_swing);
	localStorage.setItem("genre_ballad_state", $scope.filters.genre_ballad);
	localStorage.setItem("genre_funkRock_state", $scope.filters.genre_funkRock);
	localStorage.setItem("genre_latin_state", $scope.filters.genre_latin);
	localStorage.setItem("genre_bebop_state", $scope.filters.genre_bebop);

	//Save sort criteria
	localStorage.setItem("sort_criteria", $scope.filters.sort_criteria);
    }

    $scope.updateGalleryControls = function()
    {
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


	    if($scope.totalSet != -1)
	    {
		$scope.total = $('piece').length;
		$scope.showing = $('piece:visible').length;
	    }

	    $scope.isShowing();
	    $scope.setStorage();
    }
    
    $scope.change = function() {

		$location.path($scope.pathEncode());
	        $scope.updateGalleryControls();
	};


	// Decodes the search string from the URL and sets the filters
	$scope.pathDecode = function() {
	    $scope.search = $location.path().substr(1);
	  
	    if($scope.search.substr(0,5) == "views")
	    {
		$scope.isViewPath = true;
	    }

	    else
	    {
		$scope.isViewPath = false;
		
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
	    }
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


galleryControllers.controller('pieceViewController', ['$scope', '$routeParams', '$http', '$sce', 'sharedProperties', function($scope, $routeParams, $http, $sce, sharedProperties) {
    $scope.viewid = $routeParams.viewid;
    $scope.pieces = sharedProperties.retrievePieces().data;
    
    $scope.trustSrc = function(src) {
	var ref_src = $scope.replaceUrl(src);
	return $sce.trustAsResourceUrl(ref_src);
    }

    $scope.replaceUrl = function(url) {
	return url.replace("watch?v=", "v/");
    }

    $scope.getPDF = function(url) {
	
    }

    $scope.updatePDF = function(key) {
	
	$scope.old_url = $scope.current_url;
	
	if (key == "C")
	{
	    $scope.current_url = $scope.conc_url;
	}
	
	else if(key == "B")
	{
	    $scope.current_url = $scope.bflat_url;
	}

	else
	{
	    $scope.current_url = $scope.eflat_url;
	}

	if($scope.old_url != $scope.current_url)
	{
	    $scope.renderPdf();
	}
    }

    $scope.init = function()
    {
	$scope.bflat_url = "views/bflat/"+$scope.piece.view+".pdf"; 
	$scope.eflat_url = "views/eflat/"+$scope.piece.view+".pdf"; 
	$scope.conc_url = "views/c/"+$scope.piece.view+".pdf";
	$scope.current_url = $scope.conc_url;
	$scope.renderPdf();

	//Set sharedProperties current URL as current piece's view
	sharedProperties.storeCurrentURL("/views/"+$scope.piece.view);
    }
    
    $scope.renderPdf = function() {
	var urlString = $scope.piece.view 
	var pdf = new PDFObject({
	    url: $scope.current_url,
	    id: "pdfRendered",
	    pdfOpenParams: {
	    }
	}).embed("pdfRenderer");
    }
    
    //Retrieve selected piece
    for(var i=0; i< $scope.pieces.length; i++)
    {
	var piece = $scope.pieces[i];
	if($scope.viewid == piece.view)
	{
	    $scope.piece = piece;
	    break;
	}
    }

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
		    sharedProperties.storePieces($scope.jazzPieces);
		}
	    }).
	    error(function(data, status) {
		$scope.data = data || "Request failed";
		$scope.status = status;
	    });
	}
}]);
