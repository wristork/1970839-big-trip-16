import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { getFormattedEventDuration } from '../utils/date';
import { StatisticTypes } from '../const';

import AbstractView from './abstract-view';

const createStatsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time" width="900"></canvas>
    </div>
  </section>`
);

const BAR_HEIGHT = 55;
const ADD_ROW = 1;

export default class StatsComponent extends AbstractView {
  get template() {
    return createStatsTemplate();
  }

  renderStats(events) {
    const moneyChartContext = document.querySelector('#money');
    const typeChartContext = document.querySelector('#type');
    const timeChartContext = document.querySelector('#time');

    const moneyData = this.#getData(events, (event, data) => {
      if (!data.has(event.routeType)) {
        data.set(event.routeType, {
          price: 0,
          get value() {
            return this.price;
          }
        });
      }

      data.get(event.routeType).price += event.price;
    });

    const typeData = this.#getData(events, (event, data) => {
      if (!data.has(event.routeType)) {
        data.set(event.routeType, {
          count: 0,
          get value() {
            return this.count;
          }
        });
      }

      data.get(event.routeType).count++;
    });

    const timeData = this.#getData(events, (event, data) => {
      if (!data.has(event.routeType)) {
        data.set(event.routeType, {
          start: event.date.start,
          end: event.date.end,
          get value() {
            return this.end - this.start;
          }
        });
      } else {
        data.get(event.routeType).end = new Date(event.date.end - event.date.start + +data.get(event.routeType).end);
      }
    });

    this.#initChart(moneyChartContext, StatisticTypes.MONEY.toUpperCase(), [...moneyData], (value) => `€ ${value}`);
    this.#initChart(typeChartContext, StatisticTypes.TYPE.toUpperCase(), [...typeData], (value) => `${value}x`);
    this.#initChart(timeChartContext, StatisticTypes.TIME.toUpperCase(), [...timeData], (date) => getFormattedEventDuration(date.start, date.end));
  }

  #getData = (events, callback) => {
    const data = new Map();

    events.forEach((event) => {
      callback(event, data);
    });

    return data;
  };

  #initChart = (container, title, data, formatterCallback) => {
    const heightFactor = data.length + ADD_ROW;

    container.height = BAR_HEIGHT * heightFactor;
    data.sort((a, b) => b[1].value - a[1].value);

    return new Chart(container, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: data.map((item) => item[0].toUpperCase()),
        datasets: [{
          data: data.map((item) => item[1].value),
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
          barThickness: 44,
          minBarLength: 50,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: (value, context) => {
              let output;

              if (title.toUpperCase() === StatisticTypes.TIME.toUpperCase()) {
                output = formatterCallback(data[context.dataIndex][1]);
              } else {
                output = formatterCallback(value);
              }

              return output;
            },
          },
        },
        title: {
          display: true,
          text: title,
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  };
}
