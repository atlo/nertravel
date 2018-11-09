import {format, eachDay} from 'date-fns'
import 'air-datepicker'
import '../node_modules/air-datepicker/dist/js/i18n/datepicker.hu'
import {planeLocations, yachtLocations} from './locations'

const planeStartDate = new Date('2018-03-30')
const yachtStartDate = new Date('2018-02-04')
const endDate = new Date()
const dateFormat = 'YYYY. MM. DD.'
const today = format(endDate, 'YYYY.MM.DD.')

const planeLocation = document.querySelector('.plane .location')
const yachtLocation = document.querySelector('.yacht .location')

function populateLocations (startDate, locations) {
  return eachDay(startDate, endDate)
    .map(day => ({date: format(day, dateFormat)}))
    .map(day => {
      const location = locations.find(location => location.date === day.date)

      if (location) {
        day.location = location.location
      }
      
      return day
    })
    .map((day, index, days) => {
      if (index) {
        day.location = day.location || formatLocation(days[index - 1].location)
      }

      return day
    })
}

const populatedPlaneLocations = populateLocations(planeStartDate, planeLocations)
const populatedYachtLocations = populateLocations(yachtStartDate, yachtLocations)
const planeDatePicker = $('.plane-datepicker')
const yachtDatePicker = $('.yacht-datepicker')

planeLocation.innerHTML = populatedPlaneLocations[populatedPlaneLocations.length - 1].location
yachtLocation.innerHTML = populatedYachtLocations[populatedYachtLocations.length - 1].location
planeDatePicker.val(today)
yachtDatePicker.val(today)

planeDatePicker.datepicker({
  dateFormat: 'yyyy.mm.dd',
  minDate: planeStartDate,
  maxDate: endDate,
  language: 'hu',
  position: 'top right',
  onSelect (df, date) {
    planeLocation.innerHTML = populatedPlaneLocations
      .find(location => location.date === format(date, dateFormat))
      .location || planeLocation.innerHTML
  } 
})

yachtDatePicker.datepicker({
  dateFormat: 'yyyy.mm.dd',
  minDate: yachtStartDate,
  maxDate: endDate,
  language: 'hu',
  position: 'top right',
  onSelect (df, date) {
    yachtLocation.innerHTML = populatedYachtLocations
      .find(location => location.date === format(date, dateFormat))
      .location || yachtLocation.innerHTML
  } 
})

function formatLocation (location) {
  return location.split('-').pop()
}
