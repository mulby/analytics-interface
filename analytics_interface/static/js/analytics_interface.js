//Format A
nv.addGraph({
  generate: function() {
    chart = nv.models.lineWithFocusChart();

    chart.xAxis
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); });

    nv.utils.windowResize(chart.update);

    function parseDate(input) {
      var parts = input.split('-');
      return new Date(parts[0], parts[1]-1, parts[2]);
    }
    function numberWithCommas(x) {
      return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    d3.csv('data/answer_counts_per_day_hackathon.csv', function (data) {
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
      var correctSum = 0, attemptsSum = 0;
      data.forEach(function (d) {
        correctSum += parseInt(d.correct)
        attemptsSum += parseInt(d.attempts)
        organizedData[0].values.push({x: parseDate(d.date), y: correctSum}),
        organizedData[1].values.push({x: parseDate(d.date), y: attemptsSum})
      })
      $('.total-checkmarks').text("  " + numberWithCommas(correctSum.toString()) + " Checkmarks")
      $('.total-attempts').text("  " + numberWithCommas(attemptsSum.toString()) + " Attempts")
      d3.select('#chart')
        .datum(organizedData)
        .call(chart);

      d3.select('.nav-checkmarks')
        .data([{label: '.nav-checkmarks', data: organizedData[0]}]);

      d3.select('.nav-attempts')
        .data([{label: '.nav-attempts', data: organizedData[1]}]);

      d3.selectAll('.nav-button')
        .on('click', function(d, i) {
          var dispatch = d3.dispatch('legendClick', 'stateChange')
          dispatch.legendClick(d, i);
          var listItem = $(d.label).parent()
          if (listItem.hasClass('active')) {
            listItem.removeClass('active').addClass('ready')
          } else if (listItem.hasClass('ready')) {
            listItem.removeClass('ready').addClass('active')
          }
          d = d.data
          d.disabled = !d.disabled;
          dispatch.stateChange({
            disabled: data.map(function(d) { return !!d.disabled })
          });
          chart.update();
        });
    });

    return chart;
  }
});
