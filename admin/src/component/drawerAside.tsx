import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { childrenRoute } from '../router';
export default function DrawerAside() {
    const navigate = useNavigate()
    const [isShow, setIsShow] = useState(false);
    const toggleDrawer =
        (isShow: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setIsShow(isShow);
            };
    const handleClickRoute = (toPath: string) => {
        navigate(toPath)
    }
    return (
        <div>
            <span>
                <React.Fragment key={'left'}>
                    <IconButton color="primary" onClick={toggleDrawer(true)} aria-label="add to shopping cart">
                        <MenuIcon />
                    </IconButton>
                    <Drawer
                        anchor={'left'}
                        open={isShow}
                        onClose={toggleDrawer(false)}
                    >
                        <Box
                            // sx={{ width: 200 }}
                            role="presentation"
                            onClick={toggleDrawer(false)}
                            onKeyDown={toggleDrawer(false)}
                        >
                            <List>
                                {childrenRoute.map(route => (
                                    <ListItem key={route.path} disablePadding>
                                        <ListItemButton onClick={() => handleClickRoute(route.path || "")}>
                                            <ListItemText sx={{ textAlign: 'center' }} primary={route.name} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </React.Fragment>
            </span >
        </div>
    );
}