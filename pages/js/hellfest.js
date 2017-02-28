var graph_year = dc.barChart("#graph_year");
var graph_stage = dc.barChart("#graph_stage");
var graph_origin = dc.barChart("#graph_origin");

d3.csv("data/prog.csv", function(data) {
	console.log(data)
});