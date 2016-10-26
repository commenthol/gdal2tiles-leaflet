/* global L */
;(function (window) {
  function init (mapid) {
    var minZoom = 0
    var maxZoom = 5
    var img = [
      3831, // original width of image `karta.jpg`
      3101  // original height of image
    ]

    // create the map
    var map = L.map(mapid, {
      minZoom: minZoom,
      maxZoom: maxZoom
    })

    // assign map and image dimensions
    var rc = new L.RasterCoords(map, img)

    // set the view on a marker ...
    map.setView(rc.unproject([1589, 1447]), 4)

    // add layer control object
    L.control.layers({}, {
      'Polygon': layerPolygon(map, rc),
      'Countries': layerCountries(map, rc),
      'Bounds': layerBounds(map, rc, img),
      'Info': layerGeo(map, rc)
    }).addTo(map)

    // the tile layer containing the image generated with gdal2tiles --leaflet ...
    L.tileLayer('./tiles/{z}/{x}/{y}.png', {
      noWrap: true,
      attribution: 'Map <a href="https://commons.wikimedia.org/wiki/' +
        'File:Karta_%C3%B6ver_Europa,_1672_-_Skoklosters_slott_-_95177.tif">' +
        'Karta över Europa, 1672 - Skoklosters</a> under ' +
        '<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.en">CC0</a>'
    }).addTo(map)
  }

  /**
   * layer with markers
   */
  function layerBounds (map, rc, img) {
    // set marker at the image bound edges
    var layerBounds = L.layerGroup([
      L.marker(rc.unproject([0, 0])).bindPopup('[0,0]'),
      L.marker(rc.unproject(img)).bindPopup(JSON.stringify(img))
    ])
    map.addLayer(layerBounds)

    // set markers on click events in the map
    map.on('click', function (event) {
      // to obtain raster coordinates from the map use `project`
      var coord = rc.project(event.latlng)
      // to set a marker, ... in raster coordinates in the map use `unproject`
      var marker = L.marker(rc.unproject(coord))
        .addTo(layerBounds)
      marker.bindPopup('[' + Math.floor(coord.x) + ',' + Math.floor(coord.y) + ']')
        .openPopup()
    })

    return layerBounds
  }

  /**
   * layer using geoJson data for countries adding a circle marker
   */
  function layerCountries (map, rc) {
    var layerCountries = L.geoJson(window.countries, {
      // correctly map the geojson coordinates on the image
      coordsToLatLng: function (coords) {
        return rc.unproject(coords)
      },
      // add a popup content to the marker
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name)
        }
      },
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: '#800080',
          color: '#D107D1',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        })
      }
    })
    map.addLayer(layerCountries)
    return layerCountries
  }

  /**
   * layer with red markers
   */
  function layerGeo (map, rc) {
    var imgDir = 'images/'
    var redMarker = L.icon({
      iconUrl: imgDir + 'marker-icon-red.png',
      iconRetinaUrl: imgDir + 'marker-icon-red-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [-0, -31],
      shadowUrl: imgDir + 'marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [14, 41]
    })
    var layerGeo = L.geoJson(window.geoInfo, {
      // correctly map the geojson coordinates on the image
      coordsToLatLng: function (coords) {
        return rc.unproject(coords)
      },
      // add a popup content to the marker
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name)
        }
      },
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: redMarker
        })
      }
    })
    map.addLayer(layerGeo)
    return layerGeo
  }

  /**
   * layer drawing a polygon
   */
  function layerPolygon (map, rc) {
    var points = window.polygon.map(function (point) {
      return rc.unproject([point.x, point.y])
    })
    var layerPolygon = L.polygon([points])
    map.addLayer(layerPolygon)
    return layerPolygon
  }

  init('map')
}(window))
