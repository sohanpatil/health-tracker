
$(document).ready(function() {
    getWaterCaloriesAjax();
});

function getWaterCaloriesAjax() {
    //dataset is global variable depicting selected dataset
    $.get("getMFPWateCalorierData", function(data, status) {
        if (data != "error") {
            lastWeekData = []
            var obj = $.parseJSON(data);
            for (var key in obj) {
                    lastWeekData.push({
                        "calories": parseFloat(obj[key]['calories']),
                        "water": parseFloat(obj[key]['water']),
                        "date": obj[key]['date']
                    });
            }
            plot(lastWeekData);
        }
    });
}

function plot(lastWeekData){
    

    var margin = {top: 30, right: 40, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%m-%d-%Y").parse;

    var x = d3.time.scale().range([0, width]);
    var y0 = d3.scale.linear().range([height, 0]);
    var y1 = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxisLeft = d3.svg.axis().scale(y0)
        .orient("left").ticks(5);

    var yAxisRight = d3.svg.axis().scale(y1)
        .orient("right").ticks(5); 

    var valueline = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y0(d.water); }); //close
        
    var valueline2 = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y1(d.calories); }); //open
    
    var svg = d3.select("#myfitnesspal_chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    var data = lastWeekData;
    console.log(data);
    data.forEach(function(d) {
        console.log("parsing");
        d.date = parseDate(d.date);
        d.calories = +d.calories;
        d.water = +d.water;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y0.domain([0, d3.max(data, function(d) {
		return Math.max(d.water); })]); 
    y1.domain([0, d3.max(data, function(d) { 
		return Math.max(d.calories); })]);

    svg.append("path")  
        .style("stroke", "red")      // Add the valueline path.
        .attr("d", valueline(data))
        .on("mouseover", mouseover)
  		.on("mouseout", mouseout);

    svg.append("path")        // Add the valueline2 path.
        .style("stroke", "steelblue")
        .attr("d", valueline2(data))
        .on("mouseover", mouseover)
  		.on("mouseout", mouseout);

    svg.append("g")            // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style("fill", "red")
        .call(yAxisLeft);	

    svg.append("g")				
        .attr("class", "y axis")	
        .attr("transform", "translate(" + width + " ,0)")	
        .style("fill", "steelblue")		
        .call(yAxisRight);

    // hovering
    function mouseover(d) {
        var me = this;
        //d3.select(d.line).classed("line--hover", true);
        d3.selectAll(".line").classed("line--hover", function() {
          return (this === me);
        }).classed("line--fade", function() {
          return (this !== me);
        });
      }
      
      function mouseout(d) {
        console.log("out");
        d3.selectAll(".line")
          .classed("line--hover", false)
          .classed("line--fade", false);
      }
}