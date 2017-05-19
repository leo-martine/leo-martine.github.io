$( document ).ready(function() {
	
	var bom = {
		'scene':[
			{'name':'Discover stage',
			'value':0.3
			},
			{'name':'Gibson stage',
			'value':0.6
			},
			{'name':"Hard'n'heavy stage",
			'value':0.6
			},
			{'name':'Mainstage',
			'value':1
			},
			{'name':'Mainstage 01',
			'value':1
			},
			{'name':'Mainstage 02',
			'value':1
			},
			{'name':'Rock Hard tent',
			'value':0.6
			},
			{'name':'Second stage',
			'value':1
			},
			{'name':'Terrorizer tent',
			'value':0.6
			},
			{'name':'The Altar',
			'value':0.6
			},
			{'name':'The Temple',
			'value':0.6
			},
			{'name':'The Valley',
			'value':0.6
			},
			{'name':'The Warzone',
			'value':0.6
			}	
		]
	}
	console.log(bom)
	
	
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
					
					// BOM calculation (prend en compte la scene et la duree du concert)
					if(prog[i].duration && prog[i].stage){
						var sec = prog[i].duration.split(':')
						sec = (+sec[0]) * 60 * 60 + (+sec[1]) * 60 + (+sec[2]);
						for (var z in bom.scene){
							if (prog[i].stage == bom.scene[z].name){
								prog[i].bom = sec*bom.scene[z].value;
							}
						}
					}
				}
				//console.log(prog)
				hellfest(prog,bands,countries)
			})
		})
	})
})

function hellfest(prog,bands,countries){
	$('.number-bands').html(bands.length+'<br>Groupes') // number of bands
	$('.number-concerts').html(prog.length+'<br>Concerts') // number of concerts
	var ndx = crossfilter(prog);
	var nameDim = ndx.dimension(function(d){return d.band});
	var nameGroup = nameDim.group();
	var bomDim = ndx.dimension(function(d){return d.bom});
	var bomGroup = bomDim.group();
	var genreDim = ndx.dimension(function(d){return d.style});
	var genreGroup = genreDim.group();
	$('.number-genres').html(genreGroup.all().length+'<br>Genres') // number of genres
	var originDim = ndx.dimension(function(d){return d.origin});
	var originGroup = originDim.group();
	$('.number-pays').html(originGroup.all().length+'<br>Pays') // number of pays
	
	var yearDim = ndx.dimension(function(d){return d.year});
	var yearGroup = yearDim.group(); // year dim
	
	// BOM
	var bomPerBand = nameDim.group().reduceSum(function(d){return d.bom});

	var hallOfFameBands = bomPerBand.top(9)
	var maxBom = hallOfFameBands[0].value
	console.log(maxBom)
	for (var i in hallOfFameBands){
		var classement = Number(i)+1
		var percentage = (hallOfFameBands[i].value*100/maxBom).toFixed(1)
		$('#bomTableBody').append('<tr><td>'+classement+'</td><td>'+hallOfFameBands[i].key+'</td><td><div class="progress"><div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+percentage+'" aria-valuemin="0" aria-valuemax="100" style="width:'+percentage+'%">'+percentage+'%</div></div></td></tr>')
	}
	
	// Map
	
	var map = L.map('map').setView([0, 0], 2);
	var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20,
		ext: 'png'
	}).addTo(map);
	
	for (var i in yearGroup.all()){
		if (yearGroup.all()[i].key){
			$("#map-sel-year").append('<option class="optionMapYear" value="'+yearGroup.all()[i].key+'">'+yearGroup.all()[i].key+'</option>')
			
		}
	}
	$('.optionMapYear').click(function(){
		filterMapYear()
	})
	
	for (var i in genreGroup.all()){
		if (genreGroup.all()[i].key){
			$("#map-sel-style").append('<option class="optionMapStyle" value="'+genreGroup.all()[i].key+'">'+genreGroup.all()[i].key+'</option>')
		}
	}
	$('.optionMapStyle').click(function(){
		filterMapStyle()
	})
	
	$(".map-filters").click(function() {
		var filter = $(this).attr('name');
		if (filter == "map-all-groups"){
			$('#map-year-filter').hide()
			$('#map-style-filter').hide()
			filterMapAll();
		}
		else if (filter == "map-year"){
			$('#map-year-filter').show()
			$('#map-style-filter').hide()
			filterMapYear();
		}
		else if (filter == "map-style"){
			$('#map-year-filter').hide()
			$('#map-style-filter').show()
			filterMapStyle();
		}
	});
	
	function filtermap(a){
		var max,min;
		if (a[0].key){max = a[0].value}else {max = a[1].value}
		min = a[a.length-1].value;
		console.log(max,min)
		
		var originGroupAll = originGroup.all()
		map.eachLayer(function (layer) {
			if (layer._url){}
			else{
				map.removeLayer(layer);
			}
		});
		for (var i in originGroupAll){
			for (var y in countries){
				if (originGroupAll[i].key == countries[y].iso2){
					var markerCircle = new L.circleMarker([countries[y].latitude, countries[y].longitude], {
						color: '#C70039',
						fillColor: '#C70039',
						fillOpacity: 0.5,
						weight:1.5,
						radius: (Math.sqrt(originGroupAll[i].value/max)/3.14)*(3.14*40)
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
	filtermap(originGroup.top(originGroup.all().length))
	function filterMapAll(){
		yearDim.filter(null);
		genreDim.filter(null);
		filtermap(originGroup.top(originGroup.all().length))
	}
	function filterMapYear(){
		var year = $('#map-sel-year').val();
		yearDim.filter(year);
		genreDim.filter(null);
		filtermap(originGroup.top(originGroup.all().length))
	}
	function filterMapStyle(){
		var style = $('#map-sel-style').val();
		genreDim.filter(style);
		yearDim.filter(null);
		filtermap(originGroup.top(originGroup.all().length))
	}
	
	
	
}
			