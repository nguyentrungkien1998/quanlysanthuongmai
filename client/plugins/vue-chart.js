import Vue from 'vue'
import { Line , Bar , Pie , Doughnut } from 'vue-chartjs'

Vue.component('el-chart-line', {
	extends: Line,
	props: ['data', 'options'],
	mounted () {
		this.renderChart(this.data, this.options)
	},
	watch: {
		data: function() {
			this.renderChart(this.data, this.options);
		}
	},

});
Vue.component('el-chart-bar', {
	extends: Bar,
	props: ['data', 'options'],
	mounted () {
		this.renderChart(this.data, this.options)
	},
	watch: {
		data: function() {
			this.renderChart(this.data, this.options);
		}
	}
});
Vue.component('el-chart-pie', {
	extends: Pie,
	props: ['data', 'options'],
	mounted () {
		this.renderChart(this.data, this.options)
	},
	watch: {
		data: function() {
			this.renderChart(this.data, this.options);
		}
	}
})
Vue.component('el-chart-doughnut', {
	extends: Doughnut,
	props: ['data', 'options'],
	mounted () {
		this.renderChart(this.data, this.options)
	},
	watch: {
		data: function() {
			this.renderChart(this.data, this.options);
		}
	}
})
