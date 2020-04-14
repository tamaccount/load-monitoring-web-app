import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alarm } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 400,
    minWidth: 344,
  },
  typography: {
    fontWeight: 'bold',
  },
  actionRoot: {
    padding: '8px 8px 8px 16px',
    backgroundColor: '#fddc6c',
    justifyContent: 'space-between'
  },
  icons: {
    marginLeft: 'auto',
  },
  expand: {
    padding: '8px 8px',
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  collapse: {
    padding: '10px 16px',
  },
  dateTime: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8
  },
  dateTimeIcon: {
    marginRight: 8
  },
  contentDivider: {
    margin: '8px 0'
  },
}));

const SnackBarContent = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDismiss = () => {
    closeSnackbar(props.id);
  };

  return (
    <Card className={classes.card} ref={ref}>
      <CardActions classes={{ root: classes.actionRoot }}>
        <Typography variant="subtitle2" className={classes.typography}>
          {props.message.title}
        </Typography>
        <div className={classes.icons}>
          <IconButton
            href={null}
            aria-label="Show more"
            className={classNames(classes.expand, { [classes.expandOpen]: expanded })}
            onClick={handleExpandClick}
          >
            <ExpandMoreIcon />
          </IconButton>
          <IconButton href={null} className={classes.expand} onClick={handleDismiss}>
            <CloseIcon />
          </IconButton>
        </div>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Paper className={classes.collapse}>
          <Typography component="div" className={classes.dateTime}>
            <Alarm fontSize="small" className={classes.dateTimeIcon}/>
            <div>
              {moment(props.message.dateTime).format('LTS')}
            </div>
          </Typography>
          <Divider component="div" className={classes.contentDivider} />
          <Typography component="p" variant="subtitle2">
            {props.message.helpMessage}
          </Typography>
        </Paper>
      </Collapse>
    </Card>
  );
});

SnackBarContent.propTypes = {
  id: PropTypes.number.isRequired,
  message: PropTypes.object.isRequired,
};

export default SnackBarContent;
