//Format A
nv.addGraph({
  generate: function() {
    chart = nv.models.lineChart()
      .options({
        // margin: {left: 100, bottom: 100},
        // x: function(d,i) { return i},
        showXAxis: true,
        showYAxis: true,
        transitionDuration: 250
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
          color: "#ff7f0e",
          values: []
        },
        {
          key: "Attempts",
          color: "#2ca02c",
          values: []
        },
      ];
      data.forEach(function (d) {
        organizedData[0].values.push({x: parseDate(d.date), y: parseInt(d.correct)}),
        organizedData[1].values.push({x: parseDate(d.date), y: parseInt(d.attempts)})
      })
      d3.select('#test1')
        .datum(organizedData)
        .call(chart);
    });

    return chart;
  }
});
