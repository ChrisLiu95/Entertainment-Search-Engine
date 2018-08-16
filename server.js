var port = process.env.PORT || 3000;
var http = require('http');
var https = require('https');
var url = require('url');
var util = require('util');
const yelp = require('yelp-fusion');

'use strict';
 
http.createServer(function(req, res){
//     res.writeHead(200, {'Content-Type': 'text/plain'});
	res.setHeader("Access-Control-Allow-Origin","*");  // 表明当前页面可以跨域访问。默认是不允许的。
 
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    var keyword = params.keyword;
    var category = encodeURI(params.selectedCategory);
    var distance = params.distance*1610;
    var selectedLocation = params.selectedLocation;
    var nexttoken = params.nexttoken;
    var city = params.city;
    var myurl = "";
// 	console.log(nexttoken);
    var mykey = "AIzaSyDrej8ZAvvF4lN8hz7grQxgos_BWRc_IrE";
    const yelpkey = "bEwMyvGc26in9-j1hWG2QgdqMdneFFk8rfhQr8DmN0N2UJidawt1SqGPb008jI8M3DCtGAEiMSGK-YSna5ti9K0QJVHqh_YEXOJVlON7kOtqMqs73jd0EZadM_22WnYx";
/*
    console.log(req.url);
    console.log(distance);
    console.log(category);
*/
	if(selectedLocation == "here"){
		// ask nearby search directly
		var lat = params.lat;
		var lon = params.lon;
		myurl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lon+"&radius="+distance+"&type="+category+"&keyword="+keyword+"&key="+mykey;
// 		console.log(myurl);		
		https.get(myurl, res1 => {
		  res1.setEncoding("utf8");
		  body = "";
		  res1.on("data", data => {
		    body += data;
		  });
		  res1.on("end", () => {
		    body = JSON.parse(body);
/*
		    console.log(body
		    );
*/
		    res.end(JSON.stringify(body));
		  });
		});
	}else if(selectedLocation == "other"){
		// ask geo API first
		var inputLocation = params.inputLocation;
		inputLocation = encodeURI(inputLocation);
		myurl = "https://maps.googleapis.com/maps/api/geocode/json?address="+inputLocation+"&key="+mykey;
		var lat;
		var lon;
		
		https.get(myurl, res1 => {
		  res1.setEncoding("utf8");
		  body = "";
		  res1.on("data", data => {
		    body += data;
		  });
		  res1.on("end", () => {
		    body = JSON.parse(body);
		    lat = body.results[0].geometry.location.lat;
		    lon = body.results[0].geometry.location.lng;
		    myurl2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lon+"&radius="+distance+"&type="+category+"&keyword="+keyword+"&key="+mykey;	
			https.get(myurl2, res2 => {
			  res2.setEncoding("utf8");
			  body = ""; 
			  res2.on("data", data => {
			    body += data;
			  });
			  res2.on("end", () => {
			    body = JSON.parse(body);
/*
			    console.log(body
			    );
*/
			    res.end(JSON.stringify(body));
			  });
			});
			});
		});
	}
	
	if(typeof(nexttoken) != 'undefined'){
		myurl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken="+nexttoken+"&key="+mykey;
		https.get(myurl, res1 => {
		  res1.setEncoding("utf8");
		  body = "";
		  res1.on("data", data => {
		    body += data;
		  });
		  res1.on("end", () => {
		    body = JSON.parse(body);
// 		    console.log(body);
		    res.end(JSON.stringify(body));
		  });
		});

	}
	
	if(typeof(city) != "undefined"){
		var name = params.name;
		var address = params.address1;
		
		const searchRequest = {
		  term: name,
		  location: address
		};
		
		const client = yelp.client(yelpkey);
		
		client.search(searchRequest).then(response => {
		  const firstResult = response.jsonBody.businesses[0];
// 		  const prettyJson = JSON.stringify(firstResult, null, 4);
		  var placeid = firstResult.id;		  
// 		  console.log(prettyJson);
// 		  console.log(placeid);
		  client.reviews(placeid).then(response => {
			  const prettyJson = JSON.stringify(response.jsonBody.reviews);
			  console.log(prettyJson);
			  res.end(prettyJson);
			}).catch(e => {
			  console.log(e);
			});
		}).catch(e => {
		  console.log(e);
		});
	}	
//     res.write("URL:" + params.url);
}).listen(port);
