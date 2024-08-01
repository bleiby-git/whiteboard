//import { makeStyles } from "@mui/styles";
//import { makeStyles } from "@mui/material/styles";
import React from "react";
import { useState } from 'react';
import { styled } from "@mui/system";
import { Drawer, Typography } from "@mui/material";
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { SubjectOutlined } from "@mui/icons-material";
import { ColorPicker } from './ColorPicker'
import { Eraser } from "./Eraser";
import { ClearCanvas } from "./ClearCanvas";
import Canvas from './Canvas';



/* bye for now
const useStyles = styled({
    page: {
        background: '#000000',
        width: '50%'
    }
})
*/

/* doesnt work
const useStyles = makeStyles({
    page: {
        background: '#f9f9f9',
        width: '100%'
    }
})
*/

const drawerWidth = 360

const useStyles = styled({
    drawer: {
        width: drawerWidth
    },
    drawerPaper: {
        width: drawerWidth
    },
    root: {
        display: 'flex'
    }
})


export default function Layout() {
    const classes = useStyles()
    /*
    const menuItems = [
        {
            text: 'My notes',
            icon: <SubjectOutlined color='secondary' />,
            path: '/'
        }
    ]
*/
    const [color, setColor] = useState("#000000");
    const [isErasing, setIsErasing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [clearAll, setClearAll] = useState(false);

    function handleColorChange(e) {
        setColor(e.target.value);
        setIsErasing(false);  // if we changed color, make sure erasing is disabled
    }

    function handleEraserClick(e) {
        console.log('handleEraserClick:' + isErasing);
        setIsErasing((v) => v = !v);  // toggle erasing state
    }

    function handleClearAllClick(e) {
        console.log('handleClearAllClick:' + clearAll);
        setClearAll(true);
    }

    function resetClearAll() {
        console.log('resetClearAll');
        setClearAll(false);
        setIsErasing(false);
    }

    function handleLineWidthChange(e) {
        console.log('handleLineWidthChange:' + lineWidth);
        setLineWidth(e.target.value);
    }

    return (
        <div className={classes.root}>
            <Drawer className={classes.drawer} variant='permanent' anchor="left" classes={{ paper: classes.drawPaper }}>
                <div>
                    <Typography variant="h5">
                        Menu
                    </Typography>
                </div>

                <List>
                    <ListItem>
                        <ColorPicker color={color} handleColorChange={handleColorChange} />
                    </ListItem>
                    <ListItem>
                        <Eraser handleEraserClick={handleEraserClick} />
                    </ListItem>
                    <ListItem>
                        <ClearCanvas handleClearAllClick={handleClearAllClick} />
                    </ListItem>
                    <ListItem>
                        <input type="range" min="1" max="10" value={lineWidth} class="pen-ranage" onChange={(e) => handleLineWidthChange(e)} />
                    </ListItem>
                </List>
            </Drawer>
            <div>
                <Canvas color={color} isErasing={isErasing} lineWidth={lineWidth} clearAll={clearAll} resetClearAll={resetClearAll} />
            </div>
        </div>
    )
}