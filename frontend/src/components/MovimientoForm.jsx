import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField
} from '@mui/material';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';

function MovimientoForm({ existencia, onClose, onMovement, tipo }) {
  const [cantidad, setCantidad] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!cantidad) {
      alertify.error('El campo cantidad no debe estar vacío');
      return false;
    }
    if (!/^\d+$/.test(cantidad)) {
      alertify.error('El campo cantidad solo admite números enteros');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const url =
      tipo === 'entrada'
        ? 'http://localhost:4000/entradas'
        : 'http://localhost:4000/salidas';
    const payload = {
      id_existencia: existencia.id_existencia,
      ...(tipo === 'entrada'
        ? {
            cantidad_entrada: parseFloat(cantidad),
            fecha_entrada: new Date().toISOString()
          }
        : {
            cantidad_salida: parseFloat(cantidad),
            fecha_salida: new Date().toISOString()
          }),
      id_usuario: localStorage.getItem('usuarioId') // Obtener el ID del usuario desde localStorage
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        await response.json();
        alertify.success(`Movimiento de ${tipo} registrado con éxito`);
        onMovement();
        onClose();
      } else {
        const result = await response.json();
        const errorMessage = result.message || 'Error al realizar el movimiento';
        alertify.error(errorMessage);
      }
    } catch (error) {
      console.error('Error al realizar el movimiento:', error);
      alertify.error('Error al realizar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        boxShadow: 'none',
        border: 'none'
      }}
    >
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                label="Cantidad"
                fullWidth
                sx={{ marginBottom: '1rem' }}
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                inputProps={{ style: { color: 'black' } }}
                required
              />
            </Grid>
          </Grid>
          <Button variant="contained" fullWidth color="primary" type="submit">
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : tipo === 'entrada' ? (
              'Registrar Entrada'
            ) : (
              'Registrar Salida'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default MovimientoForm;
