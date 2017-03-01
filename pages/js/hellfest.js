

d3.csv("data/prog.csv", function(prog) {
	
	d3.csv("data/bands.csv", function(bands) {
		
		for (var i in prog){
			for (var y in bands){
				if (prog[i].band == bands[y].name){
					prog[i].style = bands[y].style
				}
				if (prog[i].band == bands[y].name){
					prog[i].origin = bands[y].origin
				}
			}
		}
		
		
		
		var graph_year = dc.barChart("#graph_year");
		var graph_stage = dc.pieChart("#graph_stage");
		var graph_duration = dc.pieChart("#graph_duration");
		var graph_style = dc.pieChart("#graph_style");
		var graph_origin = dc.pieChart("#graph_origin");
		
		var ndx = crossfilter(prog);
		
		var year_dim = ndx.dimension(function(d) {return d.year});
		var year_group = year_dim.group();
		
		var stage_dim = ndx.dimension(function(d) {return d.stage});
		var stage_group = stage_dim.group();
		
		var duration_dim = ndx.dimension(function(d) {return d.duration});
		var duration_group = duration_dim.group();
		
		var style_dim = ndx.dimension(function(d) {return d.style});
		var style_group = style_dim.group();
		
		var origin_dim = ndx.dimension(function(d) {return d.origin});
		var origin_group = origin_dim.group();
		
		graph_year
		.width(400)
		.height(200)
		.ordinalColors(['#d12121'])
		.x(d3.scale.ordinal())
		.xUnits(dc.units.ordinal)
		.elasticY(true)
		.brushOn(true)
		.dimension(year_dim)
		.group(year_group)
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
		
		graph_origin
		.width(200)
		.height(200)
		.innerRadius(50)
		.dimension(origin_dim)
		.group(origin_group);
		graph_origin.render();
	});
});