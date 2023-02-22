// JQuery script to track checked Amenities

const $ = window.$;
const selectedAmenities = {};
// const apiUrl = 'http://0.0.0.0:5001/api/v1/';
const apiUrl = 'http://127.0.0.1:5001/api/v1/';

$().ready(main);

function main () {
  $('input:checkbox').change(monitorAmenities);
  checkApiStatus();
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
