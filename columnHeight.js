

    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
    google.charts.load("current", {packages:['corechart']});
   google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = google.visualization.arrayToDataTable([
        ["Element", "Density", { role: "style" } ],
        ["$scaled", $scaled, "blue"],
        ["$showAnswerTarget", $target , "red"]

      ]);

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 0   ,
                         type: "string",

                         role: "annotation" },
                       2]);

      var options = {
        annotations: {
  textStyle: {
  fontName: 'Times-Roman',
  fontSize: 33,
  bold: false,
  italic: false,
  color: '#ffffff',     // The color of the text.
  auraColor: '#000000', // The color of the text outline.
  opacity: 1          // The transparency of the text.
}
},
        chartArea: {'width': '$showAnswerValue', 'height': '90%'},
        width: 600,
        height: 500,
        bar: {groupWidth: "95%"},
        legend: {position: 'none' },
        hAxis: { textPosition: 'none'
      },
        vAxis: {
          baseline:5
      },
enableInteractivity : false

      };
      var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));


      // Wait for the chart to finish drawing before calling the getImageURI() method.
        chart.draw(view, options);
  }
  </script>

    <div id="columnchart_values" style="width: 600px;margin-top:8px;  height: 600px;    margin-left: auto;
    margin-right: auto;"></div>
