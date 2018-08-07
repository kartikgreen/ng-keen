import { Injectable } from '@angular/core';
import Chart from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor() { }
  lineChart = [];
  initLinearChart(male_data?, female_data?) {
    const timeFormat = new Date().getTime();
    let config = {
        type: 'line',
        data: {
            datasets: [
                {
                    label: "Male",
                    data: male_data,
                    fill: false,
                    borderColor: 'red'
                },
                {
                    label: "Female",
                    data: female_data,
                    fill:  false,
                    borderColor: 'blue'
                }
            ]
        },
        options: {
            responsive: true,
            title:      {
                display: true,
                text: "Average Cost By Gender"
            },
            scales:     {
                xAxes: [{
                    type: "time",
                    time: {
                        parser: timeFormat,
                        tooltipFormat: 'll'
                    },
                    scaleLabel: {
                        display:     true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display:     true,
                        labelString: 'value'
                    }
                }]
            }
        }
    };
    this.lineChart = new Chart('lineChart', config);
  }
}
