$( document ).ready(function() {
	$('#map-year-filter').hide()
	$('#map-style-filter').hide()
	d3.csv("data/prog.csv", function(prog) {	
		d3.csv("data/bands.csv", function(bands) {
			d3.csv("data/countries.csv", function(countries) {
				for (var i in prog){
					for (var y in bands){
						if (prog[i].band == bands[y].name){
							prog[i].style = bands[y].style
						}
						if (prog[i].band == bands[y].name){
							prog[i].origin = bands[y].origin
						}
						if (prog[i].band == bands[y].name){
							prog[i].since = bands[y].since
						}
					}
				}
				hellfest(prog,bands,countries)
			})
		})
	})
})

function hellfest(prog,bands,countries){
	$('.number-bands').html(bands.length+'<br>Groupes') // number of bands
	$('.number-concerts').html(prog.length+'<br>Concerts') // number of concerts
	var ndx = crossfilter(prog);
	var genreDim = ndx.dimension(function(d){return d.style});
	var genreGroup = genreDim.group();
	$('.number-genres').html(genreGroup.all().length+'<br>Genres') // number of genres
	var originDim = ndx.dimension(function(d){return d.origin});
	var originGroup = originDim.group();
	$('.number-pays').html(originGroup.all().length+'<br>Pays') // number of pays
	
	var yearDim = ndx.dimension(function(d){return d.year});
	var yearGroup = yearDim.group(); // year dim
	
	// Map
	
	var map = L.map('map').setView([0, 0], 2);
	var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20,
		ext: 'png'
	}).addTo(map);
	
	for (var i in yearGroup.all()){
		if (yearGroup.all()[i].key){
			$("#map-sel-year").append('<option value="'+yearGroup.all()[i].key+'">'+yearGroup.all()[i].key+'</option>')
		}
	}
	
	for (var i in genreGroup.all()){
		if (genreGroup.all()[i].key){
			$("#map-sel-style").append('<option value="'+genreGroup.all()[i].key+'">'+genreGroup.all()[i].key+'</option>')
		}
	}
	
	$(".map-filters").click(function() {
		var filter = $(this).attr('name');
		if (filter == "map-all-groups"){
			$('#map-year-filter').hide()
			$('#map-style-filter').hide()
		}
		else if (filter == "map-year"){
			$('#map-year-filter').show()
			$('#map-style-filter').hide()
		}
		else if (filter == "map-style"){
			$('#map-year-filter').hide()
			$('#map-style-filter').show()
		}
	});

	var originGroupAll = originGroup.all()
	console.log(originGroupAll)
	console.log(countries)
	for (var i in originGroupAll){
		for (var y in countries){
			if (originGroupAll[i].key == countries[y].iso2){
				var markerCircle = new L.circleMarker([countries[y].latitude, countries[y].longitude], {
					color: '#C70039',
					fillColor: '#C70039',
					fillOpacity: 0.5,
					weight:1.5,
					radius: Math.sqrt(originGroupAll[i].value)*3.14
				}).addTo(map);
				markerCircle.bindPopup(countries[y].name+': '+originGroupAll[i].value);
				markerCircle.on('mouseover', function (e) {
					this.openPopup();
				});
				markerCircle.on('mouseout', function (e) {
					this.closePopup();
				});
			}
		}
	}
}
			