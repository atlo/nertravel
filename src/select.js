import {format, eachDay} from 'date-fns'
import 'air-datepicker'
import '../node_modules/air-datepicker/dist/js/i18n/datepicker.hu'
import {planeLocations, yachtLocations} from './locations'
import {setMarkers, removeMarkers} from './map'

const planeStartDate = new Date('2018-03-30')
const yachtStartDate = new Date('2018-02-04')
const endDate = new Date()
const dateFormat = 'YYYY.MM.DD.'
const today = format(endDate, dateFormat)

const planeLocationEl = document.querySelector('.plane .location')
const yachtLocationEl = document.querySelector('.yacht .location')
const datepickerButton = document.querySelector('.datepicker-modal-button')
const datepickerModal = document.querySelector('.datepicker-modal')
const modalBackground = document.querySelector('.modal-background')
const datepickerSearchButton = document.querySelector('.datepicker-search')

datepickerButton.innerHTML = today

const datepickerFrom = $('.datepicker-from')
const datepickerTo = $('.datepicker-to')

let dateFrom = format(endDate, dateFormat)
let dateTo = ''

function openModal () {
  modalBackground.style.display = 'block'
  datepickerModal.style.display = 'block'
}

function closeModal () {
  modalBackground.style.display = 'none'
  datepickerModal.style.display = 'none'
}

function search () {
  closeModal()
  updateDates()
  updateLocations()
}

function updateDates () {
  if (dateFrom && dateTo) {
    datepickerButton.innerHTML = `${dateFrom} - ${dateTo}`
  } else {
    datepickerButton.innerHTML = dateFrom
  }
}

function lastListItem (location) {
  return location.split(',').pop()
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

  if (dateFrom && dateTo) {
    dates = eachDay(dateFrom, dateTo)
  } else {
    dates = [dateFrom]
  }
  
  yachtLocations = dates.map(date => findLocationsByDate(populatedYachtLocations, date))
  planeLocations = dates.map(date => findLocationsByDate(populatedPlaneLocations, date))
  updateLocation(yachtLocationEl, yachtLocations[yachtLocations.length - 1])
  updateLocation(planeLocationEl, planeLocations[planeLocations.length - 1])

  removeMarkers()
  planeLocations.forEach(setMarkers)
  yachtLocations.forEach(location => setMarkers(location, false))
}

function updateLocation (locationElement, location) {
  const newLocation = location[0].location || locationElement.innerHTML
  locationElement.innerHTML = formatCities(newLocation)
}

const populatedPlaneLocations = populateLocations(planeStartDate, planeLocations)
const populatedYachtLocations = populateLocations(yachtStartDate, yachtLocations)
window.lastPlaneLocation = populatedPlaneLocations[populatedPlaneLocations.length - 1]
window.lastYachtLocation = populatedYachtLocations[populatedYachtLocations.length - 1]

planeLocationEl.innerHTML = formatCities(window.lastPlaneLocation.location)
yachtLocationEl.innerHTML = formatCities(window.lastYachtLocation.location)

datepickerFrom.datepicker({
  dateFormat: 'yyyy.mm.dd',
  minDate: yachtStartDate,
  maxDate: endDate,
  language: 'hu',
  inline: true,
  onSelect (df) {
    dateFrom = df + '.'
  }
})

datepickerTo.datepicker({
  dateFormat: 'yyyy.mm.dd',
  minDate: yachtStartDate,
  maxDate: endDate,
  language: 'hu',
  inline: true,
  onSelect (df) {
    dateTo = df + '.'
  }
})

datepickerButton.addEventListener('click', openModal)
modalBackground.addEventListener('click', closeModal)
datepickerSearchButton.addEventListener('click', search)
