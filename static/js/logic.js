// Creating the map object
let myMap = L.map("map", {
    center: [39.5, -98.5],
    zoom: 4
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

let baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(baseURL).then(function(data) {
    

    function styleInfo(feature) {
		return {
		opacity: 1,
		fillOpacity: 1,
		fillColor: getColor(feature.properties.mag),
		color: "#000000",
		radius: getRadius(feature.properties.mag),
		stroke: true,
		weight: 0.5
		};
	}
  
    function getColor(magnitude) {
		if (magnitude > 5) {
		return "#e74c3c";
		}
		if (magnitude > 4) {
		return "#f39c12";
		}
		if (magnitude > 3) {
		return "#f9e79f";
		}
		if (magnitude > 2) {
		return "#2ecc71";
		}
		if (magnitude > 1) {
		return "#5dade2";
		}
		return "#98ee00";
	}

    function getRadius(magnitude) {
		if (magnitude === 0) {
		return 1};
		return magnitude * 4;
	}

    // Creating a GeoJSON layer with the retrieved data.
  	L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each circleMarker to display the magnitude and
        //  location of the earthquake after the marker has been created and styled.
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }

  }).addTo(earthquakes);

  
	earthquakes.addTo(myMap);

    let legend = L.control({
		position: "bottomright"
	});

    // Then add all the details for the legend.
	legend.onAdd = function() {
		let div = L.DomUtil.create("div", "info legend");
		const magnitudes = [0, 1, 2, 3, 4, 5];
		const colors = [
		"#98ee00",
		"#f39c12",
		"#2ecc71",
		"#f9e79f",
		"#f39c12",
		"#e74c3c"
		];
		// Looping through our intervals to generate a label with a colored square for each interval.
		for (var i = 0; i < magnitudes.length; i++) {
			console.log(colors[i]);
			div.innerHTML +=
			"<i style='background: " + colors[i] + "'></i> " +
			magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
		}
		return div;
	};

	legend.addTo(myMap);

});