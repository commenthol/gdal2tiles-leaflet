/*
 * @copyright 2015 commenthol
 * @license MIT
 */

/* globals L */

function init() {
	var minZoom = 0,
		maxZoom = 5,
		img = [
			3831,  // original width of image
			3101   // original height of image
		];

	// create the map
	var map = L.map('map',{
			minZoom: minZoom,
			maxZoom: maxZoom,
		});

	// assign map and image dimensions
	var rc = new L.RasterCoords(map, img);
	// set the bounds on map
	rc.setMaxBounds();

	// set the view on a marker ...
	map.setView(rc.unproject([1589, 1447]), 5);

	// set marker at the image bound edges
	var layerBounds = L.layerGroup([
		L.marker(rc.unproject([0,0])).bindPopup('[0,0]'),
		L.marker(rc.unproject(img)).bindPopup(JSON.stringify(img))
	]);
	map.addLayer(layerBounds);

	// set markers on click events in the map
	map.on('click', function(event){
		var coords = rc.project(event.latlng);
		var marker = L.marker(rc.unproject(coords))
			.addTo(layerBounds);
		marker.bindPopup('['+Math.floor(coords.x)+','+Math.floor(coords.y)+']')
			.openPopup();
	});

	// geoJson definitions for country
	var countries = [
		{	type: "Feature",
			properties: { name: "Iceland" },
			geometry: { type: "Point", coordinates: [1258, 911] }
		},
		{	type: "Feature",
			properties: { name: "Ireland" },
			geometry: { type: "Point", coordinates: [1324, 1580] }
		},
		{	type: "Feature",
			properties: { name: "England" },
			geometry: { type: "Point", coordinates: [1498, 1662] }
		},
		{	type: "Feature",
			properties: { name: "France" },
			geometry: { type: "Point", coordinates: [1608, 1918] }
		},
		{	type: "Feature",
			properties: { name: "Italia" },
			geometry: { type: "Point", coordinates: [1923, 2093] }
		},
		{	type: "Feature",
			properties: { name: "Hispania" },
			geometry: { type: "Point", coordinates: [1374, 2148] }
		},
	];

	var layerCountries = L.geoJson(countries, {
		// correctly map the geojson coordinates on the image
		coordsToLatLng: function(coords) {
			return rc.unproject(coords);
		},
		// add a popup content to the marker
		onEachFeature: function (feature, layer) {
			if (feature.properties && feature.properties.name) {
				layer.bindPopup(feature.properties.name);
			}
		},
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
					radius: 8,
					fillColor: "#800080",
					color: "#D107D1",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				});
		}
	});
	map.addLayer(layerCountries);

	var imgDir = "leaflet-0.7.3/images/";

	var redMarker = L.icon({
		iconUrl: imgDir + 'marker-icon-red.png',
		iconRetinaUrl: imgDir + 'marker-icon-red-2x.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [-0, -31],
		shadowUrl: imgDir + 'marker-shadow.png',
		shadowSize: [41, 41],
		shadowAnchor: [14, 41]
	});

	// geoJson definitions
	var geoInfo = [
		{	"type": "Feature",
			"properties": { "name": "Mare Germanicum", },
			"geometry": { "type": "Point", "coordinates": [1589, 1447] },
		},
		{	"type": "Feature",
			"properties": { "name": "Mare Balticum", },
			"geometry": { "type": "Point", "coordinates": [2090, 1407] },
		},
		{	"type": "Feature",
			"properties": { "name": "Mare Mediteraneum", },
			"geometry": { "type": "Point", "coordinates": [2028, 2453] },
		},
		{	"type": "Feature",
			"properties": { "name": "Mare Maggiore", },
			"geometry": { "type": "Point", "coordinates": [2623, 1918] },
		},
	];

	var layerGeo = L.geoJson(geoInfo, {
		// correctly map the geojson coordinates on the image
		coordsToLatLng: function(coords) {
			return rc.unproject(coords);
		},
		// add a popup content to the marker
		onEachFeature: function (feature, layer) {
			if (feature.properties && feature.properties.name) {
				layer.bindPopup(feature.properties.name);
			}
		},
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {icon: redMarker});
		},
	});
	map.addLayer(layerGeo);

	// add layer control object
	L.control.layers({},{
			"Countries": layerCountries,
			"Bounds": layerBounds,
			"Info": layerGeo
		}).addTo(map);

	// the tile layer containing the image generated with gdal2tiles --leaflet ...
	L.tileLayer('./tiles/{z}/{x}/{y}.png', {
		noWrap: true,
		attribution: 'Map <a href="https://commons.wikimedia.org/wiki/'+
			'File:Karta_%C3%B6ver_Europa,_1672_-_Skoklosters_slott_-_95177.tif">'+
			'Karta över Europa, 1672 - Skoklosters</a> under '+
			'<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.en">CC0</a>',
	}).addTo(map);
}
