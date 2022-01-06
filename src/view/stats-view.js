import 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { getFormattedEventDuration } from '../utils/date';

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

export default class StatsComponent extends AbstractView {
  get template() {
    return createStatsTemplate();
  }

  renderStats(events) {
    const moneyChartContext = document.querySelector('#money');
    const typeChartContext = document.querySelector('#type');
    const timeChartContext = document.querySelector('#time');

    const moneyStats = new Map();
    const typeStats = new Map();
    const timeStats = new Map();

    events.forEach((event) => {
      if (!moneyStats.has(event.routeType)) {
        moneyStats.set(event.routeType, {
          price: 0,
          get value() {
            return this.price;
          }
        });
      }

      moneyStats.get(event.routeType).price += event.price;
    });

    events.forEach((event) => {
      if (!typeStats.has(event.routeType)) {
        typeStats.set(event.routeType, {
          count: 0,
          get value() {
            return this.count;
          }
        });
      }

      typeStats.get(event.routeType).count++;
    });

    events.forEach((event) => {
      if (!timeStats.has(event.routeType)) {
        timeStats.set(event.routeType, {
          start: event.date.start,
          end: event.date.end,
          get value() {
            return this.end - this.start;
          }
        });
      } else {
        timeStats.get(event.routeType).end = new Date(event.date.end - event.date.start + +timeStats.get(event.routeType).end);
      }
    });

    this.#initChart(moneyChartContext, 'MONEY', [...moneyStats], (value) => `€ ${value}`);
    this.#initChart(typeChartContext, 'TYPE', [...typeStats], (value) => `${value}x`);
    this.#initChart(timeChartContext, 'TIME', [...timeStats], (date) => getFormattedEventDuration(date.start, date.end));
  }

  #initChart = (container, title, data, formatterCallback) => {
    container.height = BAR_HEIGHT * (data.length + 1);
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

              if (title === 'TIME') {
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
