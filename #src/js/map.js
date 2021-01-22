$(document).ready(function(){

  ymaps.ready(init);

  function init() {

    const centerMap = (window.innerWidth > 768) ? [52.04164951696273,113.50444184918209] : (window.innerWidth>650?[52.04147750036883,113.50571858067313]:[52.04142457205223,113.50766049999996]);

    var myMap = new ymaps.Map("map", {
        center: centerMap,
        controls: [],
        zoom: 17
      }),

      point =  new ymaps.Placemark([52.04142457205223,113.50766049999996], {
        balloonContent: ''
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'img/pointer.svg',
        iconImageSize: [74, 85],
        iconImageOffset: [-30, -60]
      });

    myMap.panes.get('ground').getElement().style.filter = 'grayscale(100%)';
    myMap.behaviors.disable('scrollZoom');
    myMap.controls.add('zoomControl');

    myMap.geoObjects.add(point);

  }

});
