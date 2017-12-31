<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

  <script type="text/javascript">
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {

      var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['Work',     ~perc],
        ['Eat',      ~percRem]
      ]);

      var options = {
        pieSliceTextStyle:{fontSize:33},
        pieSliceText:'~showAnswer',
        legend: {position:'none'},
        slices: {0: {color: 'red'}, 1: {color: 'blue'}},
        pieStartAngle:~startingAngle,
        enableInteractivity : false,
        backgroundColor: 'transparent'

      };

      var chart = new google.visualization.PieChart(document.getElementById('piechart'));

chart.draw(data, options);


  }
  </script>

  <div id="piechart" style="width: 600px; margin-top:8px; height: 500px;margin-left: auto;margin-right: auto;"></div>
