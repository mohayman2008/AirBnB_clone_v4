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

  places.forEach(async function (place) {
    const placeUri = 'places/' + place.id + '/';
    const user = await getUser(place.user_id);
    const city = await fetchAPI('cities/' + place.city_id + '/');
    const state = await fetchAPI('states/' + city.state_id + '/');

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
    <DIV class="user"><STRONG>Location: </STRONG>${city.name}, ${state.name}</DIV>
    <DIV class="user"><STRONG>Owner: </STRONG>${user.first_name} ${user.last_name}</DIV>
    <DIV class="description">${place.description}</DIV>
    <DIV class="amenities">
      <DIV>
        <H2>Amenities</H2>
        <SPAN>show</SPAN>
      </DIV>
      <UL>
      </UL>
    </DIV>
    <DIV class="reviews">
      <DIV>
        <H2>Reviews</H2>
        <SPAN>show</SPAN>
      </DIV>
      <UL>
      </UL>
    </DIV>`;

    $(placeArticle).html(innerHTML);
    const amenitiesShowHideButton = $(placeArticle).children('DIV.amenities').children('DIV').children('SPAN');
    const reviewsShowHideButton = $(placeArticle).children('DIV.reviews').children('DIV').children('SPAN');

    $(amenitiesShowHideButton).click(event => { updateAmenities(placeUri, event); });
    $(reviewsShowHideButton).click(event => { updateReviews(placeUri, event); });
    $('section.places').append($(placeArticle));
  });
}

async function fetchAPI (uri) {
  const response = await $.getJSON(apiUrl + uri);
  return response;
}

async function getUser (userId) {
  const response = await $.getJSON(`${apiUrl}users/${userId}/`);
  return response;
}

async function updateAmenities (placeUri, event) {
  const span = $(event.target);
  const amenitiesDiv = $(span).parent().parent();
  const ul = $(amenitiesDiv).children('ul');
  const h2 = $(amenitiesDiv).children('DIV').children('H2');
  const amenities = await fetchAPI(placeUri + 'amenities/');

  $(ul).empty();
  if ($(span).text() === 'hide') {
    $(span).text('show');
    $(h2).text('Amenities');
    return;
  }
  $(span).text('hide');

  if (!amenities.length) {
    $(h2).text('Amenities');
  } else {
    if (amenities.length === 1) {
      $(h2).text('1 Amenity');
    } else { $(h2).text(`${amenities.length} Amenities`); }

    for (const amenity of amenities) {
      const listItem = $('<LI>');
      $(listItem).text(amenity.name);
      $(ul).append($(listItem));
    }
  }
}

async function updateReviews (placeUri, event) {
  const span = $(event.target);
  const reviewsDiv = $(span).parent().parent();
  const ul = $(reviewsDiv).children('ul');
  const h2 = $(reviewsDiv).children('DIV').children('H2');
  const reviews = await fetchAPI(placeUri + 'reviews/');

  $(ul).empty();
  if ($(span).text() === 'hide') {
    $(span).text('show');
    $(h2).text('Reviews');
    return;
  }
  $(span).text('hide');

  if (!reviews.length) {
    $(h2).text('Reviews');
  } else {
    if (reviews.length === 1) {
      $(h2).text('1 Review');
    } else { $(h2).text(`${reviews.length} Reviews`); }

    for (const review of reviews) {
      const listItem = $('<LI>');
      const user = await getUser(review.user_id);
      const userName = user.first_name + ' ' + user.last_name;
      const date = review.updated_at.slice(0, 10);

      $(listItem).append(`<H3>From ${userName}, on ${date}</H3>`);
      $(listItem).append(review.text);
      $(ul).append($(listItem));
    }
  }
}
