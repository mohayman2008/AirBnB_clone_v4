// JQuery script to track checked Amenities

const $ = window.$;
const selected = {};

$().ready(main);

function main () {
  $('input:checkbox').change((event) => {
    const current = event.target;
    if ($(current).is(':checked')) {
      selected[$(current).attr('data-id')] = $(current).attr('data-name');
    } else {
      delete selected[$(current).attr('data-id')];
    }

    updateSelectedAmenities(selected);
  });
}

function updateSelectedAmenities (selectedAmenitiesObject) {
  const h4 = $('DIV.amenities > H4');
  const selectedAmenities = Object.values(selected).join(', ');

  if (selectedAmenities === '') {
    h4.html('&nbsp;');
  } else {
    h4.text(selectedAmenities);
  }
}
