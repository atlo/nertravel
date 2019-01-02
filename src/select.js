import {format, eachDay} from 'date-fns'
import 'air-datepicker'
import '../node_modules/air-datepicker/dist/js/i18n/datepicker.hu'
import {planeLocations, plane2Locations, yachtLocations} from './locations'
import {setMarkers, removeMarkers} from './map'

const planeStartDate = new Date('2018-03-30')
const plane2StartDate = new Date('2017-12-14')
const yachtStartDate = new Date('2018-02-04')
const endDate = new Date()
const dateFormat = 'YYYY.MM.DD.'
const today = format(endDate, dateFormat)

const planeLocationEl = document.querySelector('.plane .location')
const plane2LocationEl = document.querySelector('.plane2 .location')
const yachtLocationEl = document.querySelector('.yacht .location')
const datepickerButton = document.querySelector('.datepicker-modal-button')
const datepickerModal = document.querySelector('.datepicker-modal')
const modalBackground = document.querySelector('.modal-background')
const datepickerSearchButton = document.querySelector('.datepicker-search')
const loader = document.querySelector('.loader')

datepickerButton.innerHTML = today

const datePickerFromInput = document.querySelector('.datepicker-from')
const datePickerToInput = document.querySelector('.datepicker-to')
const datepickerFrom = $('.datepicker-from')
const datepickerTo = $('.datepicker-to')

let dateFrom = format(endDate, dateFormat)
let dateTo = ''

function openModal () {
  modalBackground.classList.add('show')
  datepickerModal.classList.add('show')
}

function closeModal () {
  modalBackground.classList.remove('show')
  datepickerModal.classList.remove('show')
}

function search () {
  closeModal()
  updateDates()
  updateLocations()
}

function updateDates () {
  dateTo = datePickerToInput.value
  dateFrom = datePickerFromInput.value

  if (!dateFrom) {
    closeModal()
  } else if (dateFrom && dateTo) {
    datepickerButton.innerHTML = `${format(dateFrom, dateFormat)} - ${format(dateTo, dateFormat)}`
  } else {
    datepickerButton.innerHTML = format(dateFrom, dateFormat)
  }
}

function lastListItem (location) {
  return location ? location.split(',').pop() : ''
}

function formatCities (location) {
  return location.split(',').join('-')
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

function findLocationsByDate (locations, date) {
  return locations.filter(location => location.date === format(date, dateFormat))
}

function updateLocations () {
  let dates = []
  let yachtLocations = []
  let planeLocations = []
  let plane2Locations = []

  if (dateFrom && dateTo) {
    dates = eachDay(dateFrom, dateTo)
  } else {
    dates = [dateFrom]
  }
  
  yachtLocations = dates.map(date => findLocationsByDate(populatedYachtLocations, date))
  planeLocations = dates.map(date => findLocationsByDate(populatedPlaneLocations, date))
  plane2Locations = dates.map(date => findLocationsByDate(populatedPlane2Locations, date))

  updateLocation(yachtLocationEl, yachtLocations[yachtLocations.length - 1])
  updateLocation(planeLocationEl, planeLocations[planeLocations.length - 1])
  updateLocation(plane2LocationEl, plane2Locations[plane2Locations.length - 1])

  removeMarkers()

  planeLocations.forEach(location => setMarkers(location, 'plane'))
  plane2Locations.forEach(location => setMarkers(location, 'plane2'))
  yachtLocations.forEach(location => setMarkers(location, 'yacht'))
}

function updateLocation (locationElement, location) {
  const newLocation = location[0].location || locationElement.innerHTML
  locationElement.innerHTML = formatCities(newLocation)
}

const populatedPlaneLocations = populateLocations(planeStartDate, planeLocations)
const populatedPlane2Locations = populateLocations(plane2StartDate, plane2Locations)
const populatedYachtLocations = populateLocations(yachtStartDate, yachtLocations)

window.lastPlaneLocation = populatedPlaneLocations[populatedPlaneLocations.length - 1]
window.lastPlane2Location = populatedPlane2Locations[populatedPlane2Locations.length - 1]
window.lastYachtLocation = populatedYachtLocations[populatedYachtLocations.length - 1]

planeLocationEl.innerHTML = formatCities(window.lastPlaneLocation.location)
plane2LocationEl.innerHTML = formatCities(window.lastPlane2Location.location)
yachtLocationEl.innerHTML = formatCities(window.lastYachtLocation.location)

datepickerFrom.datepicker({
  dateFormat: 'yyyy-mm-dd',
  minDate: plane2StartDate,
  maxDate: endDate,
  startDate: plane2StartDate,
  language: 'hu',
  inline: true,
  onSelect (df) {
    dateFrom = datePickerFromInput.value
  }
})

datepickerTo.datepicker({
  dateFormat: 'yyyy-mm-dd',
  minDate: plane2StartDate,
  maxDate: endDate,
  startDate: new Date(),
  language: 'hu',
  inline: true,
  onSelect (df) {
    dateTo = datePickerToInput.value
  }
})

const datepickerFromElement = document.querySelector('.datepicker-input-from .datepicker-inline')
const datepickerToElement = document.querySelector('.datepicker-input-to .datepicker-inline')

function showDatepickerFrom () {
  datepickerFromElement.style.zIndex = 2
  datepickerToElement.style.zIndex = 1
}

function showDatepickerTo () {
  datepickerFromElement.style.zIndex = 1
  datepickerToElement.style.zIndex = 2
}

datepickerButton.addEventListener('click', openModal)
modalBackground.addEventListener('click', closeModal)
datepickerSearchButton.addEventListener('click', search)
datePickerFromInput.addEventListener('focus', showDatepickerFrom)
datePickerToInput.addEventListener('focus', showDatepickerTo)
