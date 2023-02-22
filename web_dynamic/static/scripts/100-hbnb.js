// JQuery script to track checked Amenities

const $ = window.$;
const selectedAmenities = {};
const selectedStates = [];
const selectedCities = [];
const selectedStatesCities = {};
// const apiUrl = 'http://0.0.0.0:5001/api/v1/';
const apiUrl = 'http://127.0.0.1:5001/api/v1/';

$().ready(main);

function main () {
  $('.amenities .popover>LI>INPUT:checkbox').change(monitorAmenities);
  $('.locations .popover>LI>INPUT:checkbox').change(monitorStates);
  $('.locations .popover UL INPUT:checkbox').change(monitorCities);
  $('button').click(getPlaces);
  checkApiStatus();
  getPlaces();
}

function checkApiStatus () {
  $.getJSON(apiUrl + 'status/').done((json) => {
    if (json.status === 'OK') {
      $('div#api_status').addClass('available');
    } else { $('div#api_status').removeClass('available'); }
  });
}

function monitorAmenities (event) {
  const amenity = event.target;

  if ($(amenity).is(':checked')) {
    selectedAmenities[$(amenity).attr('data-id')] = $(amenity).attr('data-name');
  } else {
    delete selectedAmenities[$(amenity).attr('data-id')];
  }

  updateSelectedAmenities();
}

function monitorStates (event) {
  const state = event.target;
  const id = $(state).attr('data-id');

  if ($(state).is(':checked')) {
    selectedStatesCities[id] = $(state).attr('data-name');
    selectedStates.push(id);
  } else {
    delete selectedStatesCities[id];
    selectedStates.splice(selectedStates.indexOf(id), 1);
  }

  updateSelectedStatesCities();
}

function monitorCities (event) {
  const city = event.target;
  const id = $(city).attr('data-id');

  if ($(city).is(':checked')) {
    selectedStatesCities[id] = $(city).attr('data-name');
    selectedCities.push(id);
  } else {
    delete selectedStatesCities[id];
    selectedCities.splice(selectedCities.indexOf(id), 1);
  }

  updateSelectedStatesCities();
}

function updateSelectedAmenities () {
  const h4 = $('DIV.amenities > H4');
  const selectedAmenitiesString = Object.values(selectedAmenities).join(', ');

  if (selectedAmenitiesString === '') {
    h4.html('&nbsp;');
  } else {
    h4.text(selectedAmenitiesString);
  }
}

function updateSelectedStatesCities () {
  const h4 = $('DIV.locations > H4');
  const selectedStatesString = Object.values(selectedStatesCities).join(', ');

  if (selectedStatesString === '') {
    h4.html('&nbsp;');
  } else {
    h4.text(selectedStatesString);
  }
}

function getPlaces () {
  const data = {
    amenities: Object.keys(selectedAmenities),
    cities: selectedCities,
    states: selectedStates
  };

  $.ajax({
    url: apiUrl + 'places_search/',
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: populatePlaces
  });
}

function populatePlaces (places) {
  $('section.places').empty();

  places.forEach(place => {
    const placeArticle = $('<ARTICLE>');
    const innerHTML = `<H2>${place.name}</H2>
    <DIV class="price_by_night">$${place.price_by_night}</DIV>
    <DIV class="information">
      <DIV class="max_guest">
        <DIV class="icon"></DIV>
        <DIV class="center">${place.max_guest} Guest</DIV>
      </DIV>
      <DIV class="number_rooms">
        <DIV class="icon"></DIV>
        <DIV class="center">${place.number_rooms} Room</DIV>
      </DIV>
      <DIV class="number_bathrooms">
        <DIV class="icon"></DIV>
        <DIV class="center">${place.number_bathrooms} Bathroom</DIV>
      </DIV>
    </DIV>
    <DIV class="description">${place.description}</DIV>`;
    // <DIV class="user"><STRONG>Owner: </STRONG>{{ place.user.first_name }} {{ place.user.last_name }}</DIV>

    $(placeArticle).html(innerHTML);
    $('section.places').append($(placeArticle));
  });
}
