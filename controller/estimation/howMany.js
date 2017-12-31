<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script type="text/javascript">
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var values=[];
    values[0]=['Age', 'Weight'];
    for (var i=0;i<~count;i++){
        var x=Math.floor(Math.random() * (101 )) ;
        var y=Math.floor(Math.random() * (101 )) ;
        values[i+1]=[x,y];
    }

    //console.log(values);
    var data = google.visualization.arrayToDataTable(values);



    var options = {
backgroundColor:'#cedbff',
colors: ['green'],
chartArea: {'width': '100%', 'height': '100%'},
      vAxis: {
gridlines: {
    color: 'transparent'
}
},
hAxis: {
gridlines: {
color: 'transparent'
}
},
      legend: 'none'
    };

    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }
</script>

<div id="chart_div" style="width: 600px; height: 600px; margin-top:8px;   margin-left: auto;margin-right: auto;"></div>
