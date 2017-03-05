
var c

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
			
			c = countries
			
			
			var graph_year = dc.barChart("#graph_year");
			var graph_stage = dc.pieChart("#graph_stage");
			var graph_duration = dc.pieChart("#graph_duration");
			var graph_style = dc.pieChart("#graph_style");
			var graph_since = dc.barChart("#graph_since");
			
			var ndx = crossfilter(prog);
			
			var year_dim = ndx.dimension(function(d) {return d.year});
			var year_group = year_dim.group();
			
			var stage_dim = ndx.dimension(function(d) {return d.stage});
			var stage_group = stage_dim.group();
			
			var duration_dim = ndx.dimension(function(d) {return d.duration});
			var duration_group = duration_dim.group();
			
			var style_dim = ndx.dimension(function(d) {return d.style});
			var style_group = style_dim.group();
			
			var since_dim = ndx.dimension(function(d) {return d.since});
			var since_group = since_dim.group();
			
			var origin_dim = ndx.dimension(function(d) {return d.origin});
			var origin_group = origin_dim.group();
			
			graph_year
			.width(400)
			.height(200)
			.x(d3.scale.ordinal())
			.xUnits(dc.units.ordinal)
			.elasticY(true)
			.brushOn(true)
			.dimension(year_dim)
			.group(year_group)
			.on('renderlet', function () {
				filterMap()
			});
			graph_year.render();
			
			graph_stage
			.width(200)
			.height(200)
			.innerRadius(50)
			.dimension(stage_dim)
			.group(stage_group);
			graph_stage.render();
			
			graph_duration
			.width(200)
			.height(200)
			.innerRadius(50)
			.dimension(duration_dim)
			.group(duration_group);
			graph_duration.render();
			
			graph_style
			.width(200)
			.height(200)
			.innerRadius(50)
			.dimension(style_dim)
			.group(style_group);
			graph_style.render();
			
			graph_since
			.width(400)
			.height(200)
			.x(d3.scale.ordinal())
			.xUnits(dc.units.ordinal)
			.elasticY(true)
			.brushOn(true)
			.dimension(since_dim)
			.group(since_group)
			graph_since.render();
			
			//map
			var map = new ol.Map({
				target: 'map',
				view: new ol.View({
				  projection: 'EPSG:4326',
				  center: [0,0],
				  zoom: 2,
				  maxZoom:15
				})
			});
			
			var basemap = new ol.layer.Tile({
			
			source: new ol.source.XYZ({
			  url: 'http://a.tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=db5ae1f5778a448ca662554581f283c5',
			  wrapX: false,
			  crossOrigin: 'anonymous'
			})
		  });
		  
	basemap.setMap(map);
			
			var countries_layer = new ol.layer.Vector({
				source: new ol.source.Vector({}),
				 style: new ol.style.Style({
					 zIndex:50,
					 image: new ol.style.Circle({
						 radius: 4,
						 fill: new ol.style.Fill({color: 'rgba(0, 0, 0, 0)'}),
						 stroke: new ol.style.Stroke({color: 'rgba(0, 0, 0, 0)',width: 1})
					 })
				 })
			}); 
			countries_layer.setMap(map)
			
			var GeoJsonFormat = new ol.format.GeoJSON();
			
			for (var i in c){
				var p = turf.point([c[i].longitude,c[i].latitude],c[i]);
				countries_layer.getSource().addFeatures(GeoJsonFormat.readFeatures(p));
			}
			
			function filterMap(){
				var d = origin_group.all()
				var f = countries_layer.getSource().getFeatures();
				for (var i in d){
					for (var y in f){
						if (d[i].key){
							if (d[i].key == f[y].get('iso2')){
								f[y].set('radius',Number(d[i].value))
							}	
						}
					}
				}
				countries_layer.setStyle(country_style)
			}
			
			var country_style = function(feature){
				return new ol.style.Style({
					image: new ol.style.Circle({
						radius: feature.get('radius'),
						fill: new ol.style.Fill({color:'rgba(255, 255, 255, 0.4)'}),
						stroke: new ol.style.Stroke({color: 'rgba(255, 255, 255, 0.8)',width: 1})
						}),
					zIndex:50
				});
			};	
		});
	});
});