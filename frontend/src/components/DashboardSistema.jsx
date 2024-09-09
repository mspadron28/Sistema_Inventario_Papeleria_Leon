import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  People,
  Work,
  LocalShipping,
  Category,
  Inventory,
  Assignment,
  ArrowDownward,
  ArrowUpward,
  TrendingUp
} from '@mui/icons-material';
import Navbar from './Navbar.jsx';

const DashboardSistema = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [providersCount, setProvidersCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [existencesCount, setExistencesCount] = useState(0);
  const [entriesCount, setEntriesCount] = useState(0);
  const [exitsCount, setExitsCount] = useState(0);

  const fetchCounts = async (url, setCount) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (typeof data.count === 'number') {
        setCount(data.count);
      } else {
        console.error(`Los datos de ${url} no contienen un campo count:`, data);
      }
    } catch (error) {
      console.error(`Error al contar datos de ${url}:`, error);
    }
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000'); // Asegúrate de que la URL sea correcta

    const fetchAllCounts = () => {
      fetchCounts('http://localhost:4000/users', setUsersCount);
      fetchCounts('http://localhost:4000/roles', setRolesCount);
      fetchCounts('http://localhost:4000/proveedores', setProvidersCount);
      fetchCounts('http://localhost:4000/categorias', setCategoriesCount);
      fetchCounts('http://localhost:4000/productos', setProductsCount);
      fetchCounts('http://localhost:4000/existencias', setExistencesCount);
      fetchCounts('http://localhost:4000/entradas', setEntriesCount);
      fetchCounts('http://localhost:4000/salidas', setExitsCount);
    };

    // Llamada inicial para obtener todos los conteos al montar el componente
    fetchAllCounts();

    ws.onmessage = (event) => {
      const { type } = JSON.parse(event.data);
      // Puedes personalizar estas condiciones dependiendo de cómo estructures tus mensajes
      if (type === 'NEW_USER') {
        fetchAllCounts(); // Actualiza todos los conteos cuando ocurra un cambio relevante
      }
    };

    ws.onopen = () => {
      console.log('Conexión WebSocket establecida');
    };

    ws.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    ws.onerror = (error) => {
      console.error('Error en la conexión WebSocket:', error);
    };

    return () => {
      ws.close(); // Cierra la conexión WebSocket al desmontar el componente
    };
  }, []);

  const cardStyles = {
    padding: 2,
    textAlign: 'center',
    color: 'text.secondary',
    boxShadow: 1,
    borderRadius: 2,
    border: '1px solid #e0e0e0'
  };

  const iconStyles = {
    fontSize: 40,
    color: 'primary.main',
    mb: 1
  };

  const percentageStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f7fa',
    borderRadius: '8px',
    padding: '4px 8px',
    color: '#00796b',
    fontSize: '14px',
    marginTop: '8px'
  };

  const additionalTextStyles = {
    color: '#9e9e9e',
    fontSize: '12px',
    marginTop: '4px'
  };

  const calculatePercentage = (count) => {
    return ((count / 100) * 100).toFixed(1) + '%';
  };

  const generateAdditionalText = (count) => {
    return `Se han agregado ${Math.floor(count)} este año`;
  };

  const stats = [
    {
      key: 'users',
      title: 'Usuarios',
      count: usersCount,
      icon: <People sx={iconStyles} />
    },
    {
      key: 'roles',
      title: 'Roles',
      count: rolesCount,
      icon: <Work sx={iconStyles} />
    },
    {
      key: 'providers',
      title: 'Proveedores',
      count: providersCount,
      icon: <LocalShipping sx={iconStyles} />
    },
    {
      key: 'categories',
      title: 'Categorías',
      count: categoriesCount,
      icon: <Category sx={iconStyles} />
    },
    {
      key: 'products',
      title: 'Productos',
      count: productsCount,
      icon: <Inventory sx={iconStyles} />
    },
    {
      key: 'existences',
      title: 'Existencias',
      count: existencesCount,
      icon: <Assignment sx={iconStyles} />
    },
    {
      key: 'entries',
      title: 'Entradas',
      count: entriesCount,
      icon: <ArrowDownward sx={iconStyles} />
    },
    {
      key: 'exits',
      title: 'Salidas',
      count: exitsCount,
      icon: <ArrowUpward sx={iconStyles} />
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box mt={2} mx="auto" maxWidth={1000} sx={{ p: 2 }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map(({ key, title, count, icon }) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Card sx={cardStyles}>
                <CardContent>
                  {icon}
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    {title}
                  </Typography>
                  <Typography variant="h3" component="div">
                    {count}
                  </Typography>
                  <Box sx={percentageStyles}>
                    <TrendingUp sx={{ fontSize: 18, marginRight: 1 }} />
                    {calculatePercentage(count)}
                  </Box>
                  <Typography sx={additionalTextStyles}>
                    {generateAdditionalText(count)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardSistema;
