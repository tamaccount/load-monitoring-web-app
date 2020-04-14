import React from 'react';
import moment from 'moment';
import PropTypes from "prop-types";

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Log from '../components/Log';
import LineSeries from '../components/LineSeries';

import { getMostRecentData } from '../utils/helper';
import { DATA_POINTS_IN_AVERAGE_PERIOD } from '../Constants';

const getAverageCpu = data => {
  if (!data.length) {
    return '--';
  }
  const sum = data.reduce((agg, { cpu }) => agg + cpu, 0);
  return (sum/data.length).toFixed(3);
};

const getMostRecentAverageCpu = data => {
  if (!data.length) {
    return {
      cpu: '--',
      lastUpdated: '--'
    };
  }
  const mostRecentData = getMostRecentData(data);
  return {
    cpu: mostRecentData.cpu.toFixed(3),
    lastUpdated: moment(mostRecentData.dateTime).format('LTS')
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    height: '100%',
  },
}));

function Dashboard(props) {
  const classes = useStyles();

  const currentCpu = getMostRecentAverageCpu(props.data);
  const tenMinuteAverage = getAverageCpu(props.data);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar className={classes.toolbar} component="div">
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container} component="div">
          <Grid container spacing={3} component="div">
            <Grid item xs={6} component="div">
              <Card className={classes.card}>
                <CardContent component="div">
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Current Average CPU Load
                  </Typography>
                  <Typography component="p" variant="h2">
                    {currentCpu.cpu}
                  </Typography>
                  <Typography color="textSecondary">
                    Last Updated: {currentCpu.lastUpdated}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} component="div">
              <Card className={classes.card}>
                <CardContent component="div">
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Average CPU Load Over 10 Minutes
                  </Typography>
                  <Typography component="p" variant="h2">
                    {tenMinuteAverage}
                  </Typography>
                  <Typography color="textSecondary">
                    {props.data.length < DATA_POINTS_IN_AVERAGE_PERIOD ?
                      '(App has not been collecting data for 10 minutes yet.)' : '' }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} component="div">
              <Card>
                <CardContent component="div">
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Average CPU Load
                  </Typography>
                  <LineSeries
                    data={props.data}
                    onRefresh={props.onRefresh}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} component="div">
              <Card>
                <CardContent component="div">
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    High & Recovered CPU Load Log
                  </Typography>
                  <Log loadData={props.loadData} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

Dashboard.propTypes = {
  data: PropTypes.array.isRequired,
  loadData: PropTypes.array.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default Dashboard;
