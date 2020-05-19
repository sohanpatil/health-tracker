function dashboard(id, fData) {
    var barColor = 'steelblue';
    function histoGram(fD) {
        var hG = {}, hGDim = { t: 60, r: 0, b: 70, l: 0 };
        chart = document.getElementById("dashboard")

        hGDim.w = chart.clientWidth - hGDim.l - hGDim.r,
            hGDim.h = 300 - hGDim.t - hGDim.b;

        d3.select(id).selectAll("svg").remove()
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
            .domain(fD.map(function (d) { return d[0]; }));
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")

        var y = d3.scale.linear().range([hGDim.h, 0])
            .domain([0, d3.max(fD, function (d) {
                return 100;
            })]);

        var bars = hGsvg.selectAll(".bar").data(fD).enter()
            .append("g").attr("class", "bar");

        bars.append("rect")
            .attr("x", function (d) { return x(d[0]); })
            .attr("y", function (d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function (d) { return hGDim.h - y(d[1]); })
            .attr('fill', barColor)


        bars.append("text").text(function (d) { return d3.format(",")(d[1].toFixed(2)) })
            .attr("x", function (d) { return x(d[0]) + x.rangeBand() / 2; })
            .attr("y", function (d) { return y(d[1]) - 5; })
            .attr("text-anchor", "middle")

        hG.update = function (nD, color) {
            y.domain([0, d3.max(nD, function (d) { return 100; })]);
            var bars = hGsvg.selectAll(".bar").data(nD);
            bars.select("rect").transition().duration(500)
                .attr("y", function (d) { return y(d[1]); })
                .attr("height", function (d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);
            bars.select("text").transition().duration(500)
                .text(function (d) { return d3.format(",")(d[1]) })
                .attr("y", function (d) { return y(d[1]) - 5; });
        }
        return hG;
    }

    var sF = fData.map(function (d) { return [d.name, d.amount, d.dailymax]; });

    hG = histoGram(sF);

}

var freqData = [

]

dashboard('#dashboard', freqData);