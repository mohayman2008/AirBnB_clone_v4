// JQuery script to track checked Amenities

const $ = window.$;
const selectedAmenities = {};
// const apiUrl = 'http://0.0.0.0:5001/api/v1/';
const apiUrl = 'http://127.0.0.1:5001/api/v1/';

$().ready(main);

function main () {
  $('input:checkbox').change(monitorAmenities);
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

  updateSelectedAmenities(selectedAmenities);
}

function updateSelectedAmenities (selectedAmenitiesObject) {
  const h4 = $('DIV.amenities > H4');
  const selectedAmenitiesString = Object.values(selectedAmenities).join(', ');

  if (selectedAmenitiesString === '') {
    h4.html('&nbsp;');
  } else {
    h4.text(selectedAmenitiesString);
  }
}

function getPlaces () {
  const data = {};

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
