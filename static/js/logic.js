// Save geoJSON URL
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// GET request for data
d3.json(link).then(function(data) {
    console.log(data);
    // Send data to createFeatures
    createFeatures(data.features);
});

// Marker size by magnitude
function markerSize(magnitude) {
    return magnitude * 10000;
}

// Marker color by depth
function markerColor(depth) {
    if (depth > 90) return "red";
    else if (depth > 70) return "orangered";
    else if (depth > 50) return "orange";
    else if (depth > 30) return "yellow";
    else if (depth > 10) return "greenyellow";
    else return "green";
}

// Create features function
function createFeatures(earthquakeData) {
    // Popup for each marker
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3>
            <hr><p>Date: ${new Date(feature.properties.time)}</p>
            <p>Magnitude: ${feature.properties.mag}</p>
            <p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    // GeoJSON for earthquakes
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            let markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.8,
                color: "#000",
                weight: 0.5,
                stroke: true
            };
            return L.circleMarker(latlng, markers);
        }
    });

    // Send layer to map
    createMap(earthquakes);
}

// Create map function
function createMap(earthquakes) {
    // Street map layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Base map
    let baseMap = {
        "Street Map": street
    };

    // Overlay map
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Initialize map object
    let myMap = L.map("map", {
        center: [36.07, -100.81],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Add depth legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "info legend"),
            labels = ["<strong>Depth</strong>"],
            depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";

        for (var i = 0; i < depth.length; i++) {
            labels.push(
                '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+')
            );
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(myMap);

    // Add layer control
    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
