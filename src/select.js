import Choices from 'choices.js'

const planeSelect = document.querySelector('#plane-choices-single-remote-fetch')
const yachtSelect = document.querySelector('#yacht-choices-single-remote-fetch')

const options = {
  shouldSort: false,
  searchEnabled: false
}

new Choices(planeSelect, options)
new Choices(yachtSelect, options)

function updatePlace (event) {
  const element = event.target
  const {value} = element[element.selectedIndex]
  const place = element.closest('.vehicle').querySelector('.place')

  place.innerHTML = value
}

planeSelect.addEventListener('change', updatePlace)
yachtSelect.addEventListener('change', updatePlace)
