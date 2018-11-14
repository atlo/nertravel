import {format, eachDay} from 'date-fns'
import 'air-datepicker'
import '../node_modules/air-datepicker/dist/js/i18n/datepicker.hu'
import {planeLocations, yachtLocations} from './locations'
import {setMarkers, removeMarkers} from './map'

const planeStartDate = new Date('2018-03-30')
const yachtStartDate = new Date('2018-02-04')
const endDate = new Date()
const dateFormat = 'YYYY. MM. DD.'
const today = format(endDate, 'YYYY.MM.DD.')

const planeLocationEl = document.querySelector('.plane .location')
const yachtLocationEl = document.querySelector('.yacht .location')

function lastListItem (location) {
  return location.split(',').pop()
}

function populateLocations (startDate, locations) {
  return eachDay(startDate, endDate)
    .map(day => ({date: format(day, dateFormat)}))
    .map(day => {
      const location = locations.find(location => location.date === day.date)

      if (location) {
        day.location = location.location
        day.latitude = location.latitude
        day.longitude = location.longitude
      }
      
      return day
    })
    .map((day, index, days) => {
      if (index) {
        day.location = day.location || lastListItem(days[index - 1].location)
        day.latitude = day.latitude || lastListItem(days[index - 1].latitude)
        day.longitude = day.longitude || lastListItem(days[index - 1].longitude)
      }

      return day
    })
}

function findLocationByDate (locations, date) {
  return locations.find(location => location.date === format(date, dateFormat))
}

function updateLocation (locationElement, location) {
  locationElement.innerHTML = location.location || locationElement.innerHTML
}

const populatedPlaneLocations = populateLocations(planeStartDate, planeLocations)
const populatedYachtLocations = populateLocations(yachtStartDate, yachtLocations)
const planeDatePicker = $('.plane-datepicker')
const yachtDatePicker = document.querySelector('.yacht-datepicker')
window.lastPlaneLocation = populatedPlaneLocations[populatedPlaneLocations.length - 1]
window.lastYachtLocation = populatedYachtLocations[populatedYachtLocations.length - 1]

planeLocationEl.innerHTML = lastPlaneLocation.location
yachtLocationEl.innerHTML = lastYachtLocation.location
planeDatePicker.val(today)
yachtDatePicker.innerHTML = today

planeDatePicker.datepicker({
  dateFormat: 'yyyy.mm.dd',
  minDate: yachtStartDate,
  maxDate: endDate,
  language: 'hu',
  position: 'top right',
  onSelect (df, date) {
    yachtDatePicker.innerHTML = df
    const planeLocation = findLocationByDate(populatedPlaneLocations, date)
    const yachtLocation = findLocationByDate(populatedYachtLocations, date)

    updateLocation(planeLocationEl, planeLocation)
    updateLocation(yachtLocationEl, yachtLocation)
    removeMarkers()
    setMarkers(planeLocation, yachtLocation)

  }
})
