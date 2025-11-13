import { List, ListItem, ListItemIcon, ListItemText, Accordion, AccordionSummary, AccordionDetails, Typography, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

export const SidebarMenu = ({ menuItems }) => {
  const location = useLocation();
  const theme = useTheme();
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    const activeAccordion = menuItems.findIndex(item => 
      item.subItems && item.subItems.some(subItem => subItem.href === location.pathname)
    );
    setOpenAccordion(activeAccordion !== -1 ? activeAccordion : null);
  }, [location.pathname, menuItems]);

  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        my: 2,
        mx: 3,
        height: { md: 'calc(100vh - 150px)', xs: 'calc(100vh - 210px)' },
      }}
    >
      {menuItems.map((item, index) => (
        item.subItems ? (
          <Accordion
            key={index}
            disableGutters
            elevation={0}
            square
            expanded={openAccordion === index}
            onChange={() => setOpenAccordion(openAccordion === index ? null : index)}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#393939' : '#FFF9F0',
              borderRadius: '10px',
              overflow: 'hidden',
              transition: 'all 0.3s ease', 
              '&:hover': {
                color: 'white',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: 'inherit' }} />}
              sx={{
                textDecoration: 'none',
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                '&:hover': {
                  backgroundColor: (theme.palette.mode === 'dark' ? '#9F5A23' : '#EF7E1B'),
                  color: 'white',
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                  '& .MuiTypography-root': {
                    color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#fff',
                  },
                },
                '& .MuiTypography-root': {
                  color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 'auto',
                  marginRight: '8px',
                  color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000'
                }}
              >
                {React.createElement(item.icon)}
              </ListItemIcon>
              <Typography sx={{ flex: 1 }}>
                {item.text}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#474747' : '#fff',
                px: '5px',
                '&:first-of-type': {
                  paddingTop: '5px',
                },
                '&:last-of-type': {
                  paddingBottom: '5px',
                },
              }}
            >
              <List
                sx={{
                  padding: 0,
                  margin: 0,
                }}
              >
                {item.subItems.map((subItem, subIndex) => {
                  const isActive = location.pathname === subItem.href;

                  return (
                    <ListItem
                      key={subIndex}
                      component={Link}
                      to={subItem.href}
                      sx={{
                        color: theme.palette.mode === 'dark' || isActive ? '#fff' : '#000',
                        backgroundColor: isActive ? (theme.palette.mode === 'dark' ? '#9F5A23' : '#EF7E1B') : 'transparent',
                        borderRadius: '5px',
                        mb: '5px',
                        boxShadow: isActive
                          ? '0px 4px 8px rgba(0, 0, 0, 0.2)'
                          : 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: (theme.palette.mode === 'dark' ? '#9F5A23' : '#EF7E1B'),
                          color: 'white', 
                          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        },
                        '&:last-of-type': {
                          mb: 0,
                        },
                        '& .MuiListItemText-root .MuiTypography-root': {
                          color: 'inherit !important',
                        },
                      }}
                    >
                      <ListItemText
                        primary={subItem.text}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        ) : (
          <ListItem
            key={index}
            component={Link}
            to={item.href}
            sx={{
              textDecoration: 'none',
              color: location.pathname === item.href ? 'white' : 'black',
              backgroundColor: location.pathname === item.href ? (theme.palette.mode === 'dark' ? '#9F5A23' : '#EF7E1B') : (theme.palette.mode === 'dark' ? '#393939' : '#FFF9F0'),
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              fontWeight: location.pathname === item.href ? 'bold' : 'normal',
              boxShadow: location.pathname === item.href ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : 'none', 
              transition: 'all 0.3s ease', 
              '&:hover': {
                backgroundColor: (theme.palette.mode === 'dark' ? '#9F5A23' : '#EF7E1B'),
                color: '#fff !important',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                '& .MuiListItemIcon-root': {
                  color: '#fff !important', 
                },
                '& .MuiListItemText-primary': {
                  color: '#fff !important', 
                }
              },
              '&:active': {
                opacity: 0.8,
                transform: 'scale(0.98)',
                '& .MuiListItemIcon-root': {
                  color: '#fff !important',
                },
                '& .MuiListItemText-primary': {
                  color: '#fff !important', 
                }
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: location.pathname === item.href
                ? '#fff' 
                : theme.palette.mode === 'dark'
                  ? '#fff'
                  : '#000',
                minWidth: 'auto',
              }}
            >
              {React.createElement(item.icon)}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: theme.palette.mode === 'dark'
                  ? '#fff'
                  : location.pathname === item.href
                    ? '#fff' 
                    : '#000',
                '&:hover': {
                  color: location.pathname === item.href || theme.palette.mode === 'dark' 
                    ? '#fff'
                    : '#555',
                },
              }} 
            />
          </ListItem>
        )
      ))}
    </List>
  );
};
