(function(){
	var app = angular.module('myApp', ['ngAnimate']);
	
/*
	app.filter('gethour', function() { 
	    return function(text) {
		    if(text != undefined){
			    var index = text.indexOf(':'); 
		        return text.substring(index+1);
	        }
	        return "";
	    }
	});
*/
	
	app.controller('myCtrl', function($scope, $http, $filter) {
		$scope.myaws = "http://chriswebsite-env.us-east-2.elasticbeanstalk.com";
		$scope.myKey = "AIzaSyDrej8ZAvvF4lN8hz7grQxgos_BWRc_IrE";
		$scope.searchbutton = true;
	    $scope.keyword = "";
	    $scope.distance = "";
	    $scope.selectedCategory = "";
	    $scope.selectedLocation = "here";
	    $scope.inputLocation = "";
	    $scope.newinputLocation = "";
	    $scope.lat = "";
	    $scope.lon = "";
	    $scope.categories = ["Default","Airport","Amusement Park","Aquarium","Art Gallery","Bakery","Bar","Beauty Salon","Bowling Alley","Bus Station","Cafe","Campground","Car Rental","Casino","Loadging","Movie Theater","Museum","Night Club","Park","Parking","Restaurant","Shopping Mall","Stadium","Subway Station","Taxi Stand","Train Station","Transit Station","Travel Agency","Zoo"];
	    $scope.travelmodes = ["Driving","Bicycling","Transit","Walking"];
	    $scope.reviewtypes = ["Google Reviews","Yelp Reviews"];
	    $scope.revieworders = ["Default Order", "Highest Rating", "Lowest Rating", "Most Recent","Least Recent"];
	    $scope.starcolor = "fa fa-star-o";
	    $scope.favor = true;
	    $scope.resulttable = false;
	    $scope.preNext = false;
	    $scope.nextbutton = false;
	    $scope.prevbutton = false;
	    $scope.progressbar = false;
	    $scope.nextPagetoken = "";
	    $scope.countnext = 0;
	    $scope.showdetails = false;
	    $scope.showinfo = false;
	    $scope.showmap = false;
	    $scope.showstreetview = false;
	    $scope.FAVORITE_DATA = "";
	    $scope.favoriteDatas = [];
	    $scope.favoritetable = false;
	    $scope.recentbutton = true;
	    $scope.sign = "http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png";
	    $scope.myloc = true;
	    $scope.myNav = true;
	    $scope.getLocalip = false;
	    $scope.yelp = "";
	    	    
	    $scope.clear = function(){
			$scope.keyword = "";
			$scope.distance = "";
		    $scope.selectedCategory = "Default";
		    $scope.selectedLocation = "here";
		    $scope.resulttable = false;
		    $scope.favoritetable = false;
		    $scope.showdetails = false;
		    $scope.showinfo = false;
		    $scope.showphoto = false;
		    $scope.wholemap = false;
		    $scope.showreview = false;
		    $scope.noresult = false;
		    $scope.nophoto = false;
		    $scope.noreview = false;
		    $scope.preNext = false;
		    $scope.nextbutton = false;
		    $scope.prevbutton = false;
		    $scope.defaultreview = false;
		    $scope.yelpreview = false;
		    $scope.searchbutton = true;
		    $scope.noFavo = false;
		    $scope.resultbutton = false;
		    $scope.progressbar = false;
		    document.getElementById('inputLocation').value = "";
	    }
		$http({
	        method: 'GET',
	        url: 'http://ip-api.com/json'
	    }).then(function successCallback(response) {
		    	$scope.getLocalip = true;
	            $scope.lat = response.data.lat;
	            $scope.lon = response.data.lon;
	        }, function errorCallback(response) {
		        $scope.getLocalip = false;
	            alert("can not get local address!");
	    });
	    
	    $scope.disable = function(){
		    $scope.myloc = true;  
	    }
	    
	    $scope.enable = function(){
		    $scope.myloc = false;
		    if(document.getElementById('inputLocation').value == ""){
			    $scope.$apply($scope.searchbutton = true); 
		    }else{
			    $scope.$apply($scope.searchbutton = false); 
		    }  
		    
	    }
	    
	    $scope.enableSearch = function(){
		    if(($scope.keyword != "" && $scope.distance != "" && $scope.getLocalip == true && $scope.selectedLocation == "here") || ($scope.keyword != "" && $scope.distance != "" && $scope.getLocalip == true && $scope.selectedLocation == "other" && document.getElementById('inputLocation').value != "")){
			    $scope.$apply($scope.searchbutton = false);
		    }else{
				$scope.$apply($scope.searchbutton = true); 
		    }
	    }
	    
	    $scope.GoogleSearch = function(){
			$scope.selectedCategoryvalue = $scope.selectedCategory.toLowerCase().replace(/\s+/g,"_");
// 			alert($scope.selectedCategoryvalue);
			$scope.countnext = 0;
			$scope.progressbar = true;
		    if($scope.selectedLocation == "here"){
			    myurl = $scope.myaws+'/detail?keyword='+$scope.keyword+"&selectedCategory="+$scope.selectedCategoryvalue+"&distance="+$scope.distance+"&selectedLocation="+$scope.selectedLocation+"&lat="+$scope.lat+"&lon="+$scope.lon;
			    $scope.mapstart = "Your Location";
//  			    alert(myurl);
		    }else if($scope.selectedLocation == "other"){
			    $scope.inputLocation = document.getElementById('inputLocation').value;
			    $scope.mapstart = $scope.inputLocation;
			    myurl = $scope.myaws+'/detail?keyword='+$scope.keyword+"&selectedCategory="+$scope.selectedCategoryvalue+"&distance="+$scope.distance+"&selectedLocation="+$scope.selectedLocation+"&inputLocation="+ $scope.inputLocation;
		    }
			$http({
		        method: 'GET',
		        url: myurl
		    }).then(function successCallback(response) {
					// response data
					$scope.progressbar = false;
					$scope.nearby1 = response.data.results;
					$scope.nearby = $scope.nearby1;
					$scope.resulttable = true;
// 					console.log($scope.nearby);
// 					alert($scope.nearby.length);
					if($scope.nearby.length == 0){
						$scope.noresult = true;
						$scope.resulttable = false;
						$scope.nextbutton = false;
					}else{
						$scope.noresult = false;
						$scope.resulttable = true;
						$scope.myNav = true;
						$scope.resultbutton = true;
					}
					for(var i = 0; i < $scope.nearby.length; i++){
						$scope.nearby[i].btnstyle = "fa fa-star-o";
						$scope.nearby[i].linestyle = "";
					}
					
					if(response.data.next_page_token == undefined){
// 						alert("no next page");
						$scope.nextbutton = false;													
					}else{
						$scope.nextbutton = true;
						$scope.nextPagetoken = response.data.next_page_token;
					}
	// 							$scope.createTable(nearby);
	// 							alert($scope.nearby.results[0].name);
		        }, function errorCallback(response) {
		            alert("something goes wrong");
		    });
	    }
	    
	    $scope.prePage = function(){
		    $scope.nearby = $scope.nearby1;
		    $scope.preNext = false;
		    $scope.nextbutton = true;
		    $scope.prevbutton = false;
	    }
	    
	    $scope.nextPage = function(nexttoken){
	// 				    $scope.progressbar = true;
		    if($scope.countnext == 0){ 
			    myurl = $scope.myaws+'/nextpage?nexttoken='+nexttoken;
			    $http({
			        method: 'GET',
			        url: myurl
			    }).then(function successCallback(response) {
	// 						    $scope.progressbar = false;
	    			$scope.nearby2 = response.data.results;
					$scope.nearby = $scope.nearby2;	
					for(var i = 0; i < $scope.nearby.length; i++){
						$scope.nearby[i].btnstyle = "fa fa-star-o";
						$scope.nearby[i].linestyle = "";
					}
					if(response.data.next_page_token == undefined){
						$scope.nextbutton = false;
						$scope.prevbutton = true;
// 							alert("no next page");							
					}else{
						$scope.nextbutton = false;
						$scope.preNext = true;
						$scope.nextPagetoken = response.data.next_page_token;
					}
	    		}); 
	    		$scope.countnext+=1; 
			}else{
	    		$scope.nearby = $scope.nearby2;
				$scope.nextbutton = false;
				$scope.preNext = true;
			}  
	    }
	    
	    $scope.displayResult = function(){
		    $scope.favoritetable = false;
		    $scope.resulttable = true;
		    $scope.noFavo = false;
		}
		
		$scope.displayFavo = function(){
			$scope.favoritetable = true;
		    $scope.resulttable = false;
		    $scope.showphoto = false;
		    $scope.showinfo = false;
		    $scope.wholemap = false;
		    $scope.showreview = false;
			$scope.showFavorite();
			$scope.preNext = false;
			$scope.nextbutton = false;
			$scope.showdetails = false;
			if($scope.favoriteDatas == ""){
		        $scope.favoritetable = false;
		        $scope.noFavo = true;
	        }else{
			    $scope.favoritetable = true;
			    $scope.noFavo = false;
	        }
		}
		
		$scope.favorite = function(placeinfo){
			if(placeinfo.btnstyle == "fa fa-star starcolor"){
				// dislike
				placeinfo.btnstyle = "fa fa-star-o";
				$scope.deleteFavorite(placeinfo);
			}else if(placeinfo.btnstyle == "fa fa-star-o"){
				// like
				placeinfo.btnstyle = "fa fa-star starcolor";
				$scope.favoriteDatas.push([placeinfo.icon,placeinfo.name,placeinfo.vicinity,[placeinfo.place_id,placeinfo.geometry.location.lat,placeinfo.geometry.location.lng,placeinfo]]);
				$scope.saveToLocalStorage($scope.favoriteDatas);
			}
			
		}
		
		$scope.saveToLocalStorage = function(data){
			localStorage.setItem($scope.FAVORITE_DATA, JSON.stringify(data));
		}
	
	    $scope.getToLocalStorage = function(){
	    	return JSON.parse(localStorage.getItem($scope.FAVORITE_DATA)) || [];
	    }
	    
	    $scope.showFavorite = function(){
		    $scope.favoriteDatas = $scope.getToLocalStorage();
	    }
	    
	    $scope.deleteFavorite = function(placeinfo){
// 		  alert(id);
		  var id = placeinfo.place_id;
	      var idx = $scope.favoriteDatas.findIndex( function (item) {
	        return item[3][0] === id;
	      })
	
	      if (idx > -1) {
	        $scope.favoriteDatas.splice(idx, 1);
	        $scope.saveToLocalStorage($scope.favoriteDatas);
	      }
	      if($scope.favoriteDatas == ""){
		      $scope.favoritetable = false;
		      $scope.noFavo = true;
	      }else{
		      $scope.favoritetable = true;
		      $scope.noFavo = false;
	      }
	    }
	
	    $scope.checkFavorite = function(placeinfo){
		  var id = placeinfo.place_id;
	      var idx = $scope.favoriteDatas.findIndex( function (item) {
	        return item[3][0] === id;
	      })
	      if (idx > -1)
	        return true;
	      else
	        return false;
	    }

	    
	    $scope.details = function(placeinfo){
		    $scope.lastplace = placeinfo;
		    $scope.showdetails = true;
		    $scope.resulttable = false;
		    $scope.favoritetable = false;
		    $scope.preNext = false;
		    $scope.nextbutton = false;
		    $scope.prevbutton = false;
		    $scope.placeDetails(placeinfo);
		    $scope.showinfo = true;
		    $scope.recentbutton = false;
		    $scope.noFavo = false;
		    $scope.resultbutton = false;

		    for(var i = 0; i < $scope.nearby.length; i++){
				$scope.nearby[i].linestyle = "";
			}
			$scope.total = placeinfo[3];
		    $scope.total.linestyle = "warning";
	    }
	    
	    $scope.showInfo = function(){
		    $scope.showinfo = true;
		    $scope.resulttable = false;
		    $scope.preNext = false;
		    $scope.nextbutton = false;
		    $scope.prevbutton = false;
		    $scope.showphoto = false;
		    $scope.wholemap = false;
		    $scope.showreview = false;
		    $scope.nophoto = false;
		    $scope.noreview = false;
		    $scope.defaultreview = false;
		    $scope.yelpreview = false;
		    
	    }
	
	    $scope.placeDetails = function(placeinfo){
		    var placeid = placeinfo[0];
		    var lat = placeinfo[1];
		    var lng = placeinfo[2];
		    var location = new google.maps.LatLng(lat,lng);
			var map = new google.maps.Map(document.getElementById('map'),{
	            center: location,
	            zoom: 15
	        });	
			var request = {
			  placeId: placeid
			};
			
			service = new google.maps.places.PlacesService(map);
			service.getDetails(request, callback);
			
			function callback(place, status) {
			  if (status == google.maps.places.PlacesServiceStatus.OK) {
				$scope.showInfo();
				$scope.printinfo(place);
				$scope.$apply($scope.placedetail = place);	
				$scope.text = encodeURI("Check out "+$scope.placedetail.name+" located at "+$scope.placedetail.formatted_address+". Website:"+$scope.placedetail.website+" #TravelAndEntertainmentSearch");
				$scope.$apply($scope.twitter="https://twitter.com/intent/tweet?text="+$scope.text);				
				if($scope.placedetail.price_level != undefined){
					var temp = $scope.placedetail.price_level;
					$scope.placedetail.price_level = "";
					for(var i = 0; i < temp; i++){
						$scope.$apply($scope.placedetail.price_level+="$");
					}
				}
				if($scope.placedetail.reviews != undefined){
					for (var i = 0; i <$scope.placedetail.reviews.length; i++){
						$scope.placedetail.reviews[i].stars = "";
						$scope.placedetail.reviews[i].time = moment.unix($scope.placedetail.reviews[i].time).format("YYYY-MM-DD HH:mm:ss");
						for(var j=0; j <$scope.placedetail.reviews[i].rating; j++ ){
							$scope.placedetail.reviews[i].stars += "⭐️";
						}
					}
				}
				
				$scope.photosUrl = [];
				if($scope.placedetail.photos != undefined){
					for (var i = 0; i < $scope.placedetail.photos.length; i++){
						if(i < 4) $scope.photosUrl.push(new Array());
						$scope.photosUrl[i%4].push($scope.placedetail.photos[i]);
					}
				}


				$scope.$apply($scope.rating = place.rating);					 
/*
				$("#rateYo").rateYo({
				    rating: $scope.rating,
				    readOnly: true
				});
*/
			  }
			}
	    }
	    
	    $scope.printinfo = function(place){
		    var info = new Array();
			info[0] = place.formatted_address;
			info[1] = place.international_phone_number;
			info[2] = place.price_level;
			info[3] = place.rating;
			info[4] = place.url;
			info[5] = place.website;
			info[6] = place.opening_hours;
			
			$scope.tr1 = false;	
		    $scope.tr2 = false;
		    $scope.tr3 = false;
		    $scope.tr4 = false;
		    $scope.tr5 = false;
		    $scope.tr6 = false;
		    $scope.tr7 = false;
	
			if(info[0] != undefined){
				$scope.tr1 = true;
			}
			if(info[1]!= undefined){
				$scope.tr2 = true;
			}
			if(info[2]!= undefined){
				$scope.tr3 = true;
			}
			if(info[3]!= undefined){
				$scope.tr4 = true;
			}
			if(info[4]!= undefined){
				$scope.tr5 = true;
			}
			if(info[5]!= undefined){
				$scope.tr6 = true;
			}
			if(info[6]!= undefined){
				$scope.tr7 = true;
				var offset = place.utc_offset;
				var t = (moment.utc(moment().valueOf() + parseInt(offset) * 60 * 1000).day() + 6) % 7;
				var day = place.opening_hours.weekday_text;
				$scope.today= day[t].split(": ")[0];
				$scope.todayTime = day[t].split(": ")[1];
				if (place.opening_hours.open_now) 
					$scope.info_open = "Open now  " + $scope.todayTime;
				else
					$scope.info_open = "Closed";
				$scope.days = [];
				for(var i = t + 1; i < 7; i ++){
					$scope.days.push({name:day[i].split(": ")[0], time:day[i].split(": ")[1]});
				}
				for(var i = 0; i < t; i ++){
					$scope.days.push({name:day[i].split(": ")[0], time:day[i].split(": ")[1]});
				}
			}
			
	/*
			alert(typeof(place.rating));
	
			$("#rateYo").rateYo({
			    rating: place.rating,
			    readOnly: true
		  	});
	*/
	
	    }
		
		$scope.mostrecent = function(lastplace){
			$scope.details([lastplace[0],lastplace[1],lastplace[2], lastplace[3]]);	
		}
		
	    $scope.mainPage = function(){
// 		    alert("main page");
		    $scope.showdetails = false;
		    $scope.resulttable = true;
		    $scope.showinfo = false;
		    $scope.showreview = false;
		    $scope.defaultreview = false;
		    $scope.yelpreview = false;
		    $scope.showphoto = false;
		    $scope.nophoto = false;
		    $scope.nextbutton = true;
		    $scope.wholemap = false;
		    $scope.resultbutton = true;
		    $scope.noreview = false;		    
	    }
	    
	    $scope.showPhotos = function(){
	// 				    alert($scope.placedetail.photos[0].getUrl({'maxWidth': 2000, 'maxHeight': 2000}));
			if($scope.placedetail.photos == undefined){
				$scope.nophoto = true;
				$scope.showphoto = false;
			}else{
				$scope.nophoto = false;
				$scope.showphoto = true;
			}
		    $scope.showinfo = false;
		    $scope.showmap = false;
		    $scope.wholemap = false;
		    $scope.showreview = false;
		    $scope.defaultreview = false;
		    $scope.yelpreview = false;
		    $scope.noreview = false;
	    }
	    
	    $scope.highresolution = function(photo){
		    var width = photo.width;
		    var height = photo.height;
		    var ref = photo.getUrl({'maxWidth': width, 'maxHeight': height})
			var hWin = window.open("","High Resolution","scrollbars = yes");
			var photoHighResolution = "";
			photoHighResolution+="<html><body style='background-color:black;'><div style='text-align:center;'><img src='"+ref+"'/></div></body></html>";
			hWin.document.write(photoHighResolution);
			hWin.document.close()
	    }
	    
	    $scope.showMaps = function(object){
	// 				    alert("show maps");
			$scope.nophoto = false;
			$scope.wholemap = true;
		    $scope.showinfo = false;
		    $scope.showphoto = false;
		    $scope.showmap = true;
		    $scope.mymap = true;
		    $scope.showstreetview = false;
		    $scope.showreview = false;
		    $scope.defaultreview = false;
		    $scope.yelpreview = false;
		    $scope.noreview = false;
		    var lat = object.geometry.location.lat();
		    var lng = object.geometry.location.lng();
		    $scope.initMap(lat,lng);
		    $scope.countstreetview = 0;
//   		    $scope.streetview(lat,lng);
	    }
	    			    			    
	    $scope.toggle = function(object){
		    document.getElementById("streetview").className = "streetview";
		    if($scope.countstreetview == 0){
			    var lat = object.geometry.location.lat();
			    var lng = object.geometry.location.lng();
			    $scope.streetview(lat,lng);
			    $scope.countstreetview += 1;
		    }
			$scope.showstreetview = !$scope.showstreetview;
			$scope.mymap = !$scope.mymap;
			$scope.route = !$scope.route;
			if($scope.sign == "http://cs-server.usc.edu:45678/hw/hw8/images/Map.png"){
				$scope.sign = "http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png";
			}else{
				$scope.sign = "http://cs-server.usc.edu:45678/hw/hw8/images/Map.png";
			}
	    }
	    
	    $scope.streetview = function(lat,lng){
		    panorama = new google.maps.StreetViewPanorama(
	        document.getElementById('streetview'),
	        {
	          position: {lat: lat, lng: lng},
	          pov: {heading: 165, pitch: 0},
	          zoom: 1
	        });				    
	    }
	    
	    $scope.getmap = function(object){
		    $scope.route = true;
		    $scope.mymap = true;
		    $scope.showstreetview = false;
		    $scope.sign = "http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png";
		    $scope.countstreetview = 0;
		    var lat = object.geometry.location.lat();
		    var lng = object.geometry.location.lng();
		    
		    var directionsDisplay = new google.maps.DirectionsRenderer;
			var directionsService = new google.maps.DirectionsService;
			
			$scope.initMap(lat,lng);
			document.getElementById('route').innerHTML = "";
			directionsDisplay.setMap($scope.map);
			directionsDisplay.setPanel(document.getElementById('route'));
			$scope.calculateAndDisplayRoute(directionsService, directionsDisplay);
	
	    }
	    
		$scope.initMap = function(lat, lng){
		    $scope.uluru = {lat: lat, lng: lng};				    
	        $scope.map = new google.maps.Map(document.getElementById("mymap"), {
	          zoom: 7,
	          center: $scope.uluru
	        });
	        $scope.marker = new google.maps.Marker({
		      position: $scope.uluru,
		      map: $scope.map  
		    });
		}
	   			    
	    $scope.calculateAndDisplayRoute = function(directionsService, directionsDisplay){
		    var start = document.getElementById('mapstarter').value;
		    if(start == "Your Location"){
			    start = {lat: $scope.lat, lng: $scope.lon};
		    }
	        var end = document.getElementById('end').value;
	        directionsService.route({
	          origin: start,
	          destination: end,
	          travelMode: $scope.travelmode.toUpperCase(),
	          provideRouteAlternatives: true
	        }, function(response, status) {
	          if (status === 'OK') {
	            directionsDisplay.setDirections(response);
	          } else {
	            window.alert('Directions request failed due to ' + status);
	          }
	        });
	    }
	    
	    $scope.showReviews = function(){
		    $scope.reviewtype = "Google Reviews";
		    $scope.order = "Default Order";
		    if($scope.placedetail.reviews == undefined){
			    $scope.noreview = true;
			    $scope.showreview = false;
			    $scope.defaultreview = false;
		    }else{
			    $scope.noreview = false;
			    $scope.showreview = true;
			    $scope.defaultreview = true;
		    }
		    $scope.wholemap = false;
		    $scope.showinfo = false;
		    $scope.showphoto = false;
		    $scope.nophoto = false;
		    $scope.yelpreview = false;
		    $scope.google = $scope.placedetail.reviews;
		    $scope.temp = JSON.stringify($scope.placedetail.reviews);
		    $scope.temp2 = JSON.parse($scope.temp);  // deep copy
		    $scope.yelpreviews();
// 		    alert($scope.yelp);		    	    
	    }
	    
	    $scope.reviewchange = function(){
		   	if($scope.reviewtype == "Google Reviews"){
			   $scope.defaultreview = true;
			   $scope.yelpreview = false;
		   	}else{
			   $scope.defaultreview = false;
			   $scope.yelpreview = true;
		   	}
	    }
	    	    
	    $scope.orderchange = function(){
		    if($scope.yelpreview == true){
			    if($scope.order === "Default Order"){
				    $scope.yelp = $scope.yelpR;
			    }else if($scope.order == "Highest Rating"){
				    var p = $scope.yelpR;
			        function down(x, y) {
			            return (x.rating < y.rating) ? 1 : -1		
			        }
			        p.sort(down);
			        $scope.yelp = p;				    
			    }else if($scope.order == "Lowest Rating"){
				    var p = $scope.yelpR;
			        function up(x, y) {
			            return (x.rating < y.rating) ? -1 : 1		
			        }
			        p.sort(up);
			        $scope.yelp = p;					    
			    }else if($scope.order == "Least Recent"){
				    var p = $scope.yelpR;
			        function up(x, y) {
			            return (x.time_created < y.time_created) ? -1 : 1		
			        }
			        p.sort(up);
			        $scope.yelp = p;	
			    }else if($scope.order == "Most Recent"){
				    var p = $scope.yelpR;
			        function down(x, y) {
			            return (x.time_created < y.time_created) ? 1 : -1		
			        }
			        p.sort(down);
			        $scope.yelp = p;
			    }
		    }else{
			    
			   	if($scope.order == "Default Order"){
				    $scope.google = $scope.temp2;
			    }else if($scope.order == "Highest Rating"){
				    var p = $scope.placedetail.reviews;
			        function down(x, y) {
			            return (x.rating < y.rating) ? 1 : -1		
			        }
			        p.sort(down);
			        $scope.google = p;				    
			    }else if($scope.order == "Lowest Rating"){
				    var p = $scope.placedetail.reviews;
			        function up(x, y) {
			            return (x.rating < y.rating) ? -1 : 1		
			        }
			        p.sort(up);
			        $scope.google = p;					    
			    }else if($scope.order == "Least Recent"){
				    var p = $scope.placedetail.reviews;
			        function up(x, y) {
			            return (x.time < y.time) ? -1 : 1		
			        }
			        p.sort(up);
			        $scope.google = p;	
			    }else if($scope.order == "Most Recent"){
				    var p = $scope.placedetail.reviews;
			        function down(x, y) {
			            return (x.time < y.time) ? 1 : -1		
			        }
			        p.sort(down);
			        $scope.google = p;
			    }				
		    }
	    }
	    
	    $scope.yelpreviews = function(){
		    myurl = $scope.myaws+"/yelp?name="+$scope.placedetail.name+"&address1="+$scope.placedetail.formatted_address+"&city="+$scope.placedetail.address_components[3].long_name+"&state="+$scope.placedetail.address_components[5].long_name;
		    // 		    alert(myurl);
		    $http({
	        method: 'GET',
	        url: myurl
		    }).then(function successCallback(response) {
					$scope.yelpR = response.data;				
					if($scope.yelpR.length != 0){
						for (var i = 0; i <$scope.yelpR.length; i++){
							$scope.yelpR[i].stars = "";
							for(var j=0; j <$scope.yelpR[i].rating; j++ ){
								$scope.yelpR[i].stars += "⭐️";
							}
						}
					}
					$scope.yelp = $scope.yelpR;
		        }, function errorCallback(response) {					        
		            alert("can not get yelp response!");
		    });
/*
		    
		    alert($scope.yelpR);
		    alert("lalala");
*/
	    }
	    
	    $scope.localstorage = function(){
			if (typeof(Storage) !== "undefined") {
			    // Store
			    localStorage.setItem("lastname", "Smith");
			    // Retrieve
			    alert(localStorage.getItem("lastname"));
			} else {
			    alert("Sorry, your browser does not support Web Storage...");
			}
	   	}		       	
	   	
	});
})();