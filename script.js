const TIMEOUT = 2000;

const renderMarker = (map, data) => {
  const marker = L.marker(data.coords)
  markerHelper(marker, map, data)
  return marker;
};


function markerHelper(marker, map, data) {
  marker.bindTooltip(`<b>${data.country} : ${data.year} FIFA World Cup Winners</b>`,
    {
      permanent: true,
      direction: 'right'
    });
  map.addLayer(marker)
  map.setView(data.coords, 4)
}

const renderMap = () => {
  const div = document.createElement('div');
  div.setAttribute('id', 'map')
  document.body.appendChild(div)

  const map = L.map('map', {
    minZoom: 2
  }).setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  setTimeout(() => {
    map.invalidateSize();
  })

  return map;
};

const makePromise = (data, index, marker, map) => new Promise((resolve) => {
  setTimeout(() => {
    marker.setLatLng(data.coords);
    markerHelper(marker, map, data)
    resolve({ marker });
  }, TIMEOUT * index);
});

const sequenceWinners = (map, marker) => {
  const sequencePromises = WINNING_NATIONS_COORDS.slice(1)
    .map((data, index) => makePromise(data, index, marker, map))
    .reduce((acc, curr) => acc.then(() => curr), Promise.resolve())

  sequencePromises.then(() => {
    setTimeout(() => {
      L.popup({
        closeButton: false,
        autoClose: false
      })
        .setLatLng([0, 0])
        .setContent('<b>You have run through all FIFA winners</b>')
        .openOn(map);
      map.setView([0, 0], 0)
    }, TIMEOUT);
  })
}



document.addEventListener('DOMContentLoaded', () => {
  const map = renderMap();
  const marker = renderMarker(map, WINNING_NATIONS_COORDS[0]);
  setTimeout(() => {
    sequenceWinners(map, marker);
  }, TIMEOUT);
})