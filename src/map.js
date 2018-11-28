import yachtIcon from './images/jacht_ikon.svg'
import planeIcon from './images/repulo_ikon.svg'
import yachtPoint from './images/jacht_pont.svg'
import planePoint from './images/repulo_pont.svg'

const markers = []
const lines = []

let map
let bounds

export function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.49833, lng: 19.04083},
    zoom: 8,
    styles: [
      {
        "featureType": "road",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#bdd3e1"
          }
        ]
      }
    ]
  })

  bounds = new google.maps.LatLngBounds()
  map.fitBounds(bounds)

  setMarkers([window.lastPlaneLocation])
  setMarkers([window.lastYachtLocation], false)
}

function formatCoordinates (coordinates) {
  const latitudes = coordinates.latitude.split(',')
  const longitudes = coordinates.longitude.split(',')
  
  return latitudes.map((lat, index) => {
    return {
        lat: Number(lat),
        lng: Number(longitudes[index])
    }
  })
}

function createMarkers (coordinates, location, isPlane = true) {
  const icon = isPlane ? planeIcon : yachtIcon
  const point = isPlane ? planePoint : yachtPoint
  const lineColor = isPlane ? '#1722b1' : '#f15a24'
  
  coordinates.forEach(function(coordinate, index) {
    bounds.extend(coordinate)

    if (index === coordinates.length - 1) {
      markers.push(new google.maps.Marker({
        map,
        icon: `${window.location}/dist/${icon}`,
        position: coordinate
      }))
    } else if (index === 0) {
      markers.push(new google.maps.Marker({
        map,
        icon: `${window.location}/dist/${point}`,
        position: coordinate
      }))
    }
  })

  const line = new google.maps.Polyline({
    path: coordinates,
    strokeColor: lineColor,
    strokeOpacity: 1.0,
    strokeWeight: 4,
    map: map
  })

  lines.push(line)
  
  const infoWindow = new google.maps.InfoWindow()

  google.maps.event.addListener(line, 'mouseover', function(event) {
    infoWindow.setPosition(event.latLng)
    infoWindow.setContent(location.date)
    infoWindow.open(map)
  })
  
  google.maps.event.addListener(line, 'mouseout', function() {
    infoWindow.close()
  })
}

export function setMarkers (coordinates, isPlane = true) {
  const formattedCoordinates = coordinates.map(formatCoordinates)
  formattedCoordinates.forEach((coordinate, index) => {
    createMarkers(coordinate, coordinates[index], isPlane)
  })
  
  map.fitBounds(bounds)
}

export function removeMarkers () {
  markers.forEach(marker => marker.setMap(null))
  lines.forEach(line => line.setMap(null))
}
