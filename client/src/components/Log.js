import React from 'react';
import PropTypes from "prop-types";
import moment from 'moment';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import ReportIcon from '@material-ui/icons/Report';
import ReportOffIcon from '@material-ui/icons/ReportOff';

import { loadTypes } from '../Constants';

function Log({ loadData }) {
  const getTaleRows = () => {
    if (!loadData.length) {
      return (
        <TableRow component="tr">
          <TableCell colSpan={3}>
            CPU has yet to be under heavy CPU load (or recovery from heavy CPU load).
          </TableCell>
        </TableRow>
      )
    }
    return [...loadData].reverse().map((row, key) => (
      <TableRow key={key} component="tr">
        <TableCell>
          {row.type === loadTypes.HIGH ? (
            <Chip
              label={loadTypes.HIGH}
              color="secondary"
              component="div"
              icon={<ReportIcon />}
            />
          ) : (
            <Chip
              label={loadTypes.RECOVERED}
              color="primary"
              component="div"
              icon={<ReportOffIcon />}
            />
          )}
        </TableCell>
        <TableCell>{row.occurrence}</TableCell>
        <TableCell>
          {moment(row.dateTime).format("ddd, MMMM Do YYYY, h:mm:ss a")}
        </TableCell>
      </TableRow>
    ))
  };

  return (
    <TableContainer component="div">
      <Table component="table">
        <TableHead component="thead">
          <TableRow component="tr">
            <TableCell>Type</TableCell>
            <TableCell>Occurrence of Type</TableCell>
            <TableCell>Datetime</TableCell>
          </TableRow>
        </TableHead>
        <TableBody component="tbody">
          {getTaleRows()}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Log.propTypes = {
  loadData: PropTypes.array.isRequired,
};

export default Log;
