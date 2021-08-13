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
import WorkTwoToneIcon from '@material-ui/icons/WorkTwoTone';
import BookmarkTwoToneIcon from '@material-ui/icons/BookmarkTwoTone';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import { Switch, Route, Link } from "react-router-dom";
import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";


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
  const [applChange, setApplChange] = React.useState(0);
  const [amzn, setAmzn] = React.useState(0);
  const [amznChange, setAmznChange] = React.useState(0);
  const [fb, setFb] = React.useState(0);
  const [fbChange, setFbChange] = React.useState(0);
  const [nflx, setNflx] = React.useState(0);
  const [nflxChange, setNflxChange] = React.useState(0);
  const [googl, setGoogl] = React.useState(0);
  const [googlChange, setGooglChange] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [showModeratorBoard, setShowModeratorBoard] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(undefined);
  const [showAdminBoard, setShowAdminBoard] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios.get(`https://finnhub.io/api/v1/quote?symbol=FB&token=c1lmcqq37fkqle0e1u80`).then(({ data }) => {
        setFb(data["c"].toPrecision(5));
        setFbChange(data["d"]);
    });
    axios.get(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=c1lmcqq37fkqle0e1u80`).then(({ data }) => {
        setAppl(data["c"].toPrecision(5));
        setApplChange(data["d"]);
    });
    axios.get(`https://finnhub.io/api/v1/quote?symbol=AMZN&token=c1lmcqq37fkqle0e1u80`).then(({ data }) => {
        setAmzn(data["c"].toPrecision(6));
        setAmznChange(data["d"]);
    });
    axios.get(`https://finnhub.io/api/v1/quote?symbol=NFLX&token=c1lmcqq37fkqle0e1u80`).then(({ data }) => {
        setNflx(data["c"].toPrecision(5));
        setNflxChange(data["d"]);
    });
    axios.get(`https://finnhub.io/api/v1/quote?symbol=GOOGL&token=c1lmcqq37fkqle0e1u80`).then(({ data }) => {
        setGoogl(data["c"].toPrecision(6));
        setGooglChange(data["d"]);
    });

    const user = AuthService.getCurrentUser();

    if (user) {
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    setCount(1);

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
          <Typography variant="h6" noWrap>
            <Link to={"/"} className="navbar-brand">
              Stonkers
            </Link>
          </Typography>
          <Typography variant="h6" className="navStocks" noWrap>
            FB
            <br />
            {fbChange && fbChange > 0 && <span className="positive">{fb}<ArrowDropUpIcon/></span>}
            {fbChange && fbChange < 0 && <span className="negative">{fb}<ArrowDropDownIcon/></span>} 
          </Typography>
          <Typography variant="h6" className="navStocks" noWrap>
            APPL 
            <br />
            {applChange && applChange > 0 && <span className="positive">{appl}<ArrowDropUpIcon/></span>}
            {applChange && applChange < 0 && <span className="negative">{appl}<ArrowDropDownIcon/></span>} 
          </Typography>
          <Typography variant="h6" className="navStocks" noWrap>
            AMZN 
            <br />
            {amznChange && amznChange > 0 && <span className="positive">{amzn}<ArrowDropUpIcon/></span>}
            {amznChange && amznChange < 0 && <span className="negative">{amzn}<ArrowDropDownIcon/></span>} 
          </Typography>
          <Typography variant="h6" className="navStocks" noWrap>
            NFLX 
            <br />
            {nflxChange && nflxChange > 0 && <span className="positive">{nflx}<ArrowDropUpIcon/></span>}
            {nflxChange && nflxChange < 0 && <span className="negative">{nflx}<ArrowDropDownIcon/></span>} 
          </Typography>
          <Typography variant="h6" className="navStocks" noWrap>
            GOOGL 
            <br />
            {googlChange && googlChange > 0 && <span className="positive">{googl}<ArrowDropUpIcon/></span>}
            {googlChange && googlChange < 0 && <span className="negative">{googl}<ArrowDropDownIcon/></span>} 
          </Typography>

          <div className="navbar-nav ml-auto" style={{ flex: 1 }}>
            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  User
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}

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
              <ListItemIcon>{index % 2 === 0 ? <WorkTwoToneIcon /> : <BookmarkTwoToneIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <br></br>
      <br></br>
      <br></br>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} onClick={()=>{window.location.href = '/login';}} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/mod" component={BoardModerator} />
            <Route path="/admin" component={BoardAdmin} />
          </Switch>
        </div>
    </div>
  );
}