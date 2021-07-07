import React, { useEffect } from 'react';
import axios from "axios";
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BookmarkTwoToneIcon from '@material-ui/icons/BookmarkTwoTone';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer() {

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [appl, setAppl] = React.useState(0);
  const [amzn, setAmzn] = React.useState(0);
  const [fb, setFb] = React.useState(0);
  const [nflx, setNflx] = React.useState(0);
  const [googl, setGoogl] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios.get(`https://finnhub.io/api/v1/quote?symbol=FB&token=c1lmcqq37fkqle0e1u80`).then(({ data }) => {
        setFb(data["c"].toPrecision(5));
    });
    axios.get(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=c1lmcqq37fkqle0e1u80`).then(({ data }) => {
        setAppl(data["c"].toPrecision(5));
    });
    axios.get(`https://finnhub.io/api/v1/quote?symbol=AMZN&token=c1lmcqq37fkqle0e1u80`).then(({ data }) => {
        setAmzn(data["c"].toPrecision(6));
    });
    axios.get(`https://finnhub.io/api/v1/quote?symbol=NFLX&token=c1lmcqq37fkqle0e1u80`).then(({ data }) => {
        setNflx(data["c"].toPrecision(5));
    });
    axios.get(`https://finnhub.io/api/v1/quote?symbol=GOOGL&token=c1lmcqq37fkqle0e1u80`).then(({ data }) => {
        setGoogl(data["c"].toPrecision(6));
    });
    setCount(1)
  }, [count])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="navStocks" noWrap>
            FB
            <br />
            {fb}
          </Typography>
          <Typography variant="h6" className="navStocks" noWrap>
            APPL 
            <br />
            {appl}
          </Typography>
          <Typography variant="h6" className="navStocks" noWrap>
            AMZN 
            <br />
            {amzn}
          </Typography>
          <Typography variant="h6" className="navStocks" noWrap>
            NFLX 
            <br />
            {nflx}
          </Typography>
          <Typography variant="h6" className="navStocks" noWrap>
            GOOGL 
            <br />
            {googl}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {['Portfolio', 'Bookmarked'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <AccountCircleIcon /> : <BookmarkTwoToneIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}