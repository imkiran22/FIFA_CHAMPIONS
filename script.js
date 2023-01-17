const TIMEOUT = 1500;

const renderMap = () => {
  const div = document.createElement('div');
  div.setAttribute('id', 'map')
  document.body.appendChild(div)

  const map = L.map('map', {
    minZoom: 4
  }).setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  setTimeout(() => {
    map.invalidateSize()
  })

  return map;
};

const makePromise = (data, index, map) => new Promise((resolve) => {
  setTimeout(() => {
    const marker = L.marker(data.coords)
    marker.bindTooltip(`<b>${data.country} : ${data.year} FIFA World Cup Winners</b>`,
      {
        permanent: true,
        direction: 'right'
      });
    map.addLayer(marker)
    map.setView(data.coords, 4)
    resolve({ marker });
  }, TIMEOUT * index);
});

const sequenceWinners = (map) => {
  const sequencePromises = WINNING_NATIONS_COORDS
    .map((data, index) => makePromise(data, index, map))
    .reduce((acc, curr) => acc.then(() => curr)
      .then(({ marker }) => {
        setTimeout(() => {
          map.removeLayer(marker)
        }, TIMEOUT)
      }), Promise.resolve())

  sequencePromises.then(() => {
    setTimeout(() => {
      L.popup({
        closeButton: false,
        autoClose: false
      })
        .setLatLng([0, 0])
        .setContent('<b>You have run through all fifa winners</b>')
        .openOn(map);
      map.setView([0, 0], 0)
    }, TIMEOUT);
  })
}



document.addEventListener('DOMContentLoaded', () => {
  const map = renderMap();
  sequenceWinners(map);
})