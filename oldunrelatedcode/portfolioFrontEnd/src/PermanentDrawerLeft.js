import React, {Component} from 'react';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from '@material-ui/core/styles';
import Portfolio from './Portfolio';

const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        appBar: {
            width: `calc(100% - 240px)`,
            marginLeft: 240,
        },
        drawer: {
            width: 240,
            flexShrink: 0,
        },
        drawerPaper: {
            width: 240,
        },
        toolbar: theme.mixins.toolbar,
        content:{
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        },
        splitscreen: {
            display: 'flex',
            flexDirection: 'row'
        },
        leftpane: {
            width: '50%'
        },
        rightpane: {
            width: '50%'
        },
    }))

export default function PermanentDrawerLeft() {
    const classes = useStyles();
    return (
        <div>
            <div className={classes.root}>
                <CssBaseline />
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                    paper: classes.drawerPaper,
                    }}
                    anchor="left"
                >
                    <div className={classes.toolbar}>GAINZ</div>
                    <Divider />
                    <List>
                    {['Portfolio'].map((text, index) => (
                        <ListItem button key={text}>
                        <ListItemText primary={text} />
                        </ListItem>
                    ))}
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Portfolio/>
                </main>
            </div>
        </div>
        );
    
}
