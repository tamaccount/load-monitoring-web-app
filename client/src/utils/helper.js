import { every } from "underscore";

import {
  HIGH_LOAD_CPU_DEFINITION,
  DATA_POINTS_IN_EACH_MINUTE,
  HIGH_LOAD_CPU_TIME_IN_MINUTES,
  RECOVERY_HIGH_LOAD_CPU_TIME_IN_MINUTES
} from '../Constants';

const dataPointsInHighLoadPeriod =
  HIGH_LOAD_CPU_TIME_IN_MINUTES * DATA_POINTS_IN_EACH_MINUTE;
const dataPointsInRecoveredPeriod =
  RECOVERY_HIGH_LOAD_CPU_TIME_IN_MINUTES * DATA_POINTS_IN_EACH_MINUTE;

export const isLoadHigh = data => {
  const minimumPoints = dataPointsInHighLoadPeriod;
  if (data.length < minimumPoints) {
    return false;
  }
  return every(
    data.slice(-1 * minimumPoints),
    ({ cpu }) => cpu >= HIGH_LOAD_CPU_DEFINITION
  );
};

export const isLoadRecovered = (data, _isLoadHigh) => {
  if (!_isLoadHigh) {
    return false;
  }

  const endIndex = -1 * dataPointsInRecoveredPeriod;
  return every(data.slice(endIndex), ({ cpu }) => cpu < HIGH_LOAD_CPU_DEFINITION);
};

export const getMostRecentData = data =>
  data[data.length - 1];
