import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';

import Dashboard from './pages/Dashboard';

import {
  loadTypes,
  HIGH_LOAD_CPU_DEFINITION,
  HIGH_LOAD_CPU_TIME_IN_MINUTES,
  RECOVERY_HIGH_LOAD_CPU_TIME_IN_MINUTES
} from './Constants';
import { isLoadHigh, isLoadRecovered, getMostRecentData } from './utils/helper';

const highLoadCpuMessage =
  `CPU is considered under high average load when it has exceeded
   ${HIGH_LOAD_CPU_DEFINITION} for ${HIGH_LOAD_CPU_TIME_IN_MINUTES} minutes or more.`;

const recoveredHighLoadCpuMessage =
  `CPU is considered "recovered" from high average load when it drops below
   ${HIGH_LOAD_CPU_DEFINITION} for ${RECOVERY_HIGH_LOAD_CPU_TIME_IN_MINUTES} minutes or more.`;

const getOccurrenceOfType = (loadData, _type) =>
  loadData.filter(({ type }) => type === _type).length + 1;

class App extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
      loadData: [],
      isLoadHigh: false
    };

    this.setCpu = this.setCpu.bind(this);
  }

  componentDidMount() {
    this.setCpu();
  }

  componentDidUpdate(prevProps, prevState) {
    const mostRecentData = getMostRecentData(this.state.data);
    const mostRecentDateTime = mostRecentData ? mostRecentData.dateTime : 0;

    if (!prevState.isLoadHigh && this.state.isLoadHigh) {
      const message = {
        title: 'CPU load is high',
        dateTime: mostRecentDateTime,
        helpMessage: highLoadCpuMessage
      };

      this.props.enqueueSnackbar(message, {
        autoHideDuration: 10*60*1000,
        // variant: 'warning',
      });

      this.setState({
        loadData: [...this.state.loadData, {
          type: loadTypes.HIGH,
          dateTime: mostRecentDateTime,
          occurrence: getOccurrenceOfType(this.state.loadData, loadTypes.HIGH),
        }]
      });
    }

    if (isLoadRecovered(this.state.data, this.state.isLoadHigh)) {
      const message = {
        title: 'CPU has recovered from high load',
        dateTime: mostRecentDateTime,
        helpMessage: recoveredHighLoadCpuMessage
      };

      this.props.enqueueSnackbar(message, {
        autoHideDuration: 10*60*1000,
        // variant: 'info',
      });

      this.setState({
        isLoadHigh: false,
        loadData: [...this.state.loadData, {
          type: loadTypes.RECOVERED,
          dateTime: mostRecentDateTime,
          occurrence: getOccurrenceOfType(this.state.loadData, loadTypes.RECOVERED),
        }]
      });
    }
  }

  getCpu = async () => {
    const response = await fetch('/cpu');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  setCpu() {
    return this.getCpu()
      .then(res => {
        const newData = [...this.state.data, res];
        this.setState({
          data: newData,
          isLoadHigh: this.state.isLoadHigh || isLoadHigh(newData)
        })
      })
      .catch(err => {
        this.props.enqueueSnackbar({
          title: 'Error',
          dateTime: Date.now(),
          helpMessage: err.toString()
        }, {
          autoHideDuration: 10*60*1000,
          variant: 'error',
        });
      });
  }

  render() {
    return (
      <div className="App">
        <Dashboard
          data={this.state.data}
          onRefresh={this.setCpu}
          loadData={this.state.loadData}
        />
      </div>
    );
  }
}

App.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(App);
