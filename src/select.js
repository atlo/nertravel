import Choices from 'choices.js'

const selectButton = document.querySelector('.date-select')
const select = document.querySelector('#choices-single-remote-fetch')

const planePlace = document.querySelector('.plane .place')
const yachtPlace = document.querySelector('.yacht .place')
const yachtDate = document.querySelector('.yacht .date')

new Choices(select, {searchEnabled: false})

function updatePlace () {
  const {value, text} = select[select.selectedIndex]

  planePlace.innerHTML = value
  yachtPlace.innerHTML = value
  yachtDate.innerHTML = text
}

selectButton.addEventListener('click', function () {
  document.querySelector('.choices__list--dropdown').classList.toggle('is-active')
})

select.addEventListener('change', updatePlace)

updatePlace()