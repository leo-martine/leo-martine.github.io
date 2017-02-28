

d3.csv("data/prog.csv", function(data) {
	console.log(data)
	
	var graph_year = dc.barChart("#graph_year");
	var graph_stage = dc.pieChart("#graph_stage");
	var graph_duration = dc.pieChart("#graph_duration");
	
	var ndx = crossfilter(data);
	console.log(ndx)
	var year_dim = ndx.dimension(function(d) {return d.year});
	var year_group = year_dim.group();
	
	var stage_dim = ndx.dimension(function(d) {return d.stage});
	var stage_group = stage_dim.group();
	
	var duration_dim = ndx.dimension(function(d) {return d.duration});
	var duration_group = duration_dim.group();
	
	graph_year
    .width(400)
    .height(200)
	.ordinalColors(['#d12121'])
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
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
});