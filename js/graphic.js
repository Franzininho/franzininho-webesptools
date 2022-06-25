//Grafico
	
	var config_line = {
	  type: 'line',
	  data: {
		labels: [],
		datasets: [{
		  label: 'Gráfico',
		  data: [],
		  borderWidth: 1,
		  borderColor: 'rgba(255,0,0,0.85)',
		  backgroundColor: 'transparent',
		}]
	  },
	  options: {
		responsive: true,
		maintainAspectRatio: false,
		title: {
		  display: true,
		  text: 'Valor'
		},
		tooltips: {
		  mode: 'index',
		  intersect: false,
		},
		hover: {
		  mode: 'nearest',
		  intersect: true
		},
		scales: {
		  xAxes: [{
			type: 'time',
			time: {
				unit: 'minute',
				unitStepSize: 1,
				displayFormats: {
				   'minute': 'hh:mm:ss'
				}
			},
			ticks: {
			  minRotation: 60,
			  source: 'data'  
			},
			distribution: 'series',
			display: true,
			scaleLabel: {
			  display: true,
			  labelString: 'Hora'
			}
		  }],
		  yAxes: [{
			display: true,
			scaleLabel: {
			  display: true
			},
			ticks: {
				beginAtZero: true,
				steps: 10,
				stepValue: 2,
				max: 1200
			}
		  }]
		}
	  }
	};

	function createMyLine() {
	  var ctx = document.getElementById('canvas').getContext('2d');
	  window.myLine = new Chart(ctx, config_line);
	};
	
	