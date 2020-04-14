import React from 'react';
import PropTypes from "prop-types";
import 'chartjs-plugin-streaming';
import { Line } from 'react-chartjs-2';

import {
  SECONDS_IN_MINUTES,
  REFRESH_DURATION_SECONDS,
  AVERAGE_PERIOD_DEFINED_IN_MINUTES
} from '../Constants'

const AVERAGE_PERIOD_DEFINED_IN_SECONDS =
  SECONDS_IN_MINUTES * AVERAGE_PERIOD_DEFINED_IN_MINUTES;

class LineSeries extends React.Component {
  constructor() {
    super();

    this.chartReference = React.createRef();
  }

  render() {
    return (
      <Line
        data={{
          datasets: [
            {
              label: 'Average CPU Load',
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              lineTension: 0,
              data: this.props.data.map(data => ({
                x: data.dateTime,
                y: data.cpu
              }))
            },
          ]
        }}
        options={{
          scales: {
            xAxes: [{
              type: 'realtime',
              ticks: {
                maxTicksLimit: 10
              },
              scaleLabel: {
                display: true,
                labelString: 'Time'
              },
              time: {
                displayFormats: {
                  quarter: 'h:mm:ss a'
                }
              },
              realtime: {
                onRefresh: () => {
                  this.props.onRefresh().then(() => {
                    this.chartReference.chartInstance.update()
                  });
                },
                refresh: REFRESH_DURATION_SECONDS * 1000,
                duration: AVERAGE_PERIOD_DEFINED_IN_SECONDS*1000,
                delay: 0
              }
            }],
            yAxes: [{
              ticks: {
                suggestedMin: 0,
              },
              scaleLabel: {
                display: true,
                labelString: 'CPU'
              }
            }]
          }
        }}
        ref={el => this.chartReference = el}
      />
    )
  }
}

LineSeries.propTypes = {
  data: PropTypes.array.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default LineSeries;
