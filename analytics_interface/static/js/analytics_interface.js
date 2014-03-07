//Format A
nv.addGraph({
  generate: function() {
  	var height = 500, width = 1000;
    chart = nv.models.lineChart()
      .options({
        showXAxis: true,
        showYAxis: true,
        transitionDuration: 250,
        useInteractiveGuideline: true,
        width: width,
        height: height
      });

    chart.xAxis
        .axisLabel('Date')
        .rotateLabels(-45)
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); });

    chart.yAxis
        .axisLabel('Count')
        .tickFormat(d3.format('d'));


    nv.utils.windowResize(chart.update);

    function parseDate(input) {
      var parts = input.split('-');
      return new Date(parts[0], parts[1]-1, parts[2]);
    }

    d3.csv('data/answer_counts_per_day.csv', function (data) {
      var organizedData = [
        {
          key: "Correct",
          color: "#FFFFFF",
          values: [],
        },
        {
          key: "Attempts",
          color: "#4A433D",
          values: [],
        },
      ];
      data.forEach(function (d) {
        organizedData[0].values.push({x: parseDate(d.date), y: parseInt(d.correct)}),
        organizedData[1].values.push({x: parseDate(d.date), y: parseInt(d.attempts)})
      })
      d3.select('#test1')
        .datum(organizedData)
        .attr('width', width)
        .attr('height', height)
        .call(chart);
    });

    return chart;
  }
});
