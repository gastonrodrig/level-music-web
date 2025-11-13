import React from 'react';
import { Drawer, Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Collapse } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export const ProtectedDrawer = ({ drawerOpen, handleDrawerToggle, menuItems = [] }) => {
  const [openItems, setOpenItems] = React.useState({});
  const theme = useTheme(); 

  const handleToggle = (text) => {
    setOpenItems((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={drawerOpen}
      onClose={handleDrawerToggle}
      sx={{
        '& .MuiDrawer-paper': {
          bgcolor: theme.palette.primary.main,
          color: 'white',
          width: 250,
        },
      }}
    >
      <Box
        sx={{
          width: 250,
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  component={item.href ? Link : 'button'}
                  to={item.href || '#'}
                  onClick={item.subItems ? () => handleToggle(item.text) : handleDrawerToggle}
                  sx={{ color: 'white' }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.subItems && (openItems[item.text] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              {item.subItems && (
                <Collapse in={openItems[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem key={subItem.text} disablePadding>
                        <ListItemButton
                          component={Link}
                          to={subItem.href}
                          onClick={handleDrawerToggle}
                          sx={{ pl: 4, color: 'white' }}
                        >
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
