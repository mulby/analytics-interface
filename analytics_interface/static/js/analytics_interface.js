//Format A
nv.addGraph({
  generate: function() {
  	var height = 500, width = 1000;
    chart = nv.models.lineWithFocusChart()
      .options({
        showXAxis: true,
        showYAxis: true,
        transitionDuration: 250,
        useInteractiveGuideline: true,
        width: width,
        height: height,
        showLegend: false
      });

    chart.xAxis
        .axisLabel('Date')
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); });

    chart.yAxis
        .axisLabel('Count')
        .tickFormat(d3.format('d'));

    nv.utils.windowResize(chart.update);

    function parseDate(input) {
      var parts = input.split('-');
      return new Date(parts[0], parts[1]-1, parts[2]);
    }
    function numberWithCommas(x) {
      return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      var lastDataPoint = data[data.length - 1];
      $('.total-checkmarks').text(numberWithCommas(lastDataPoint.correct) + " Checkmarks")
      $('.total-attempts').text(numberWithCommas(lastDataPoint.attempts) + " Attempts")
      container = d3.select('#test1')
        .datum(organizedData)
        .attr('width', width)
        .attr('height', height)
        .call(chart);

      d3.select('.nav-checkmarks')
        .data([organizedData[0]]);

      d3.select('.nav-attempts')
        .data([organizedData[1]]);

      d3.selectAll('.nav-button')
        .on('click', function(d, i) {
          var dispatch = d3.dispatch('legendClick', 'stateChange')
          dispatch.legendClick(d, i);
          d.disabled = !d.disabled;
          if (organizedData.every(function(series) { return series.disabled})) {
            //the default behavior of NVD3 legends is, if every single series
            // is disabled, turn all series' back on.
            organizedData.forEach(function(series) { series.disabled = false});
          }
          dispatch.stateChange({
            disabled: data.map(function(d) { return !!d.disabled })
          });
          chart.update();
        });
    });

    return chart;
  }
});
