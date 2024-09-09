import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalShipping,
  Assignment,
  Category as CategoryIcon,
  ProductionQuantityLimits as ProductionQuantityLimitsIcon,
  Inventory as InventoryIcon,
  Input as InputIcon,
  Output as OutputIcon,
  Report as ReportIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

import adminImage from '../assets/images/admin.png';
import bodegaImage from '../assets/images/bodega.png';
import gerenteImage from '../assets/images/gerente.png';
import gestorImage from '../assets/images/gestor.png';

const drawerWidth = 240;

const Navbar = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(localStorage.getItem('tipoUsuario'));
  const [userName, setUserName] = useState(localStorage.getItem('userName'));

  useEffect(() => {
    if (!tipoUsuario) {
      navigate('/');
    } else {
      // Fetch user info if needed, e.g., name
      const fetchUserInfo = async () => {
        try {
          const response = await fetch(`http://localhost:4000/users/${localStorage.getItem('usuarioId')}`);
          const data = await response.json();
          setUserName(data.nombre_usuario);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      fetchUserInfo();
    }
  }, [tipoUsuario, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('userName');
    setTipoUsuario(null);
    navigate('/');
  };

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const userTypeInfo = {
    '1': { name: 'Administrador', image: adminImage },
    '2': { name: 'Bodega', image: bodegaImage },
    '3': { name: 'Gerente', image: gerenteImage },
    '4': { name: 'Gestor', image: gestorImage },
  }[tipoUsuario];

  const renderMenuItems = () => {
    const menuItems = [];

    if (tipoUsuario === '1') {
      menuItems.push(
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
        { text: 'Usuarios', icon: <PeopleIcon />, link: '/dashUser' },
        { text: 'Proveedores', icon: <LocalShipping />, link: '/dashProveedor' },
        { text: 'Categorías', icon: <CategoryIcon />, link: '/dashCategoria' },
        { text: 'Productos', icon: <ProductionQuantityLimitsIcon />, link: '/dashProducto' },
        { text: 'Existencias', icon: <Assignment />, link: '/dashExistencia' },
        { text: 'Entradas', icon: <InputIcon />, link: '/dashEntrada' },
        { text: 'Salidas', icon: <OutputIcon />, link: '/dashSalida' },
        { text: 'Existencias Mínimas', icon: <ReportIcon />, link: '/reporteMinExis' }
      );
    } else if (tipoUsuario === '2') {
      menuItems.push(
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
        { text: 'Existencias', icon: <Assignment />, link: '/dashExistencia' },
         { text: 'Entradas', icon: <InputIcon />, link: '/dashEntrada' },
        { text: 'Salidas', icon: <OutputIcon />, link: '/dashSalida' },
        { text: 'Existencias Mínimas', icon: <ReportIcon />, link: '/reporteMinExis' }

      );
    } else if (tipoUsuario === '3') {
      menuItems.push(
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
        { text: 'Entradas', icon: <InputIcon />, link: '/dashEntrada' },
        { text: 'Salidas', icon: <OutputIcon />, link: '/dashSalida' },
        { text: 'Existencias Mínimas', icon: <ReportIcon />, link: '/reporteMinExis' }
      );
    } else if (tipoUsuario === '4') {
      menuItems.push(
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
        { text: 'Proveedores', icon: <LocalShipping />, link: '/dashProveedor' },
        { text: 'Categorías', icon: <InventoryIcon />, link: '/dashCategoria' },
        { text: 'Productos', icon: <InventoryIcon />, link: '/dashProducto' }
      );
    }

    return (
      <List sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {menuItems.map((item, index) => (
          <Tooltip key={index} title={item.text} arrow placement="right">
            <ListItem
              button
              component={Link}
              to={item.link}
              onClick={item.action}
              sx={{
                '&:hover': {
                  backgroundColor: '#2c3848',
                  '& .MuiListItemIcon-root': {
                    color: '#FFF'
                  },
                  '& .MuiListItemText-primary': {
                    color: '#FFF'
                  }
                },
                backgroundColor:
                  hoveredItem === index ? '#2c3848' : 'transparent'
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <ListItemIcon sx={{ color: '#FFF' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Tooltip>
        ))}
        <Divider />
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            backgroundColor:
              hoveredItem === menuItems.length ? '#2c3848' : 'transparent',
            marginTop: 'auto',
            '&:hover': {
              backgroundColor: '#2c3848',
              '& .MuiListItemIcon-root': {
                color: '#FFF'
              },
              '& .MuiListItemText-primary': {
                color: '#FFF'
              }
            }
          }}
          onMouseEnter={() => handleMouseEnter(menuItems.length)}
          onMouseLeave={handleMouseLeave}
        >
          <ListItemIcon sx={{ color: '#FFF' }}>
            <CloseIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
      <CssBaseline />
      <Drawer
  variant="permanent"
  anchor="left"
  open={true}
  sx={{
    width: { xs: drawerWidth, sm: drawerWidth },
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: '#1A202C',
      color: '#FFF',
      height: '100vh',
      top: 0,
      zIndex: 1000
    }
  }}
>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2,
            mb: 2,
            p: 2
          }}
        >
          <Avatar
            src={userTypeInfo?.image}
            alt={userTypeInfo?.name}
            sx={{ width: 90, height: 90}}
          />
          <Box sx={{ textAlign: 'center', color: '#FFF' }}>
            <h3>Bienvenido, {userName}</h3>
            <p>{userTypeInfo?.name}</p>
          </Box>
        </Box>
        {renderMenuItems()}
      </Drawer>
    </Box>
  );
};

export default Navbar;
