import {
  Button,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import ExistenciaForm from './ExistenciaForm.jsx';
import MovimientoForm from './MovimientoForm.jsx';
import { useMediaQuery } from '@mui/material';

import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#02152B',
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

function ExistenciaList() {
  const [existencias, setExistencias] = useState([]);
  const [open, setOpen] = useState(false);
  const [openMovimiento, setOpenMovimiento] = useState(false);
  const [selectedExistencia, setSelectedExistencia] = useState(null);
  const [movimientoTipo, setMovimientoTipo] = useState('');

  const cargarExistencias = async () => {
    try {
      const response = await fetch('http://localhost:4000/existencias');
      const data = await response.json();
      if (Array.isArray(data.existencias)) {
        const existenciasUnicas = data.existencias.reduce((acc, existencia) => {
          const found = acc.find(
            (e) => e.id_existencia === existencia.id_existencia
          );
          if (found) {
            found.gestionada_por += `, ${existencia.gestionada_por}`;
          } else {
            acc.push({
              ...existencia,
              gestionada_por: existencia.gestionada_por
            });
          }
          return acc;
        }, []);
        setExistencias(existenciasUnicas);
      } else {
        console.error('Los datos de existencias no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar existencias:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenMovimiento = (existencia, tipo) => {
    setSelectedExistencia(existencia);
    setMovimientoTipo(tipo);
    setOpenMovimiento(true);
  };

  const handleCloseMovimiento = () => {
    setOpenMovimiento(false);
    setSelectedExistencia(null);
    setMovimientoTipo('');
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
    cargarExistencias();

    ws.onmessage = (event) => {
      const { type } = JSON.parse(event.data);
      // Puedes personalizar estas condiciones dependiendo de cómo estructures tus mensajes
      if (type === 'NEW_ENTRADA' || type === 'NEW_SALIDA') {
        cargarExistencias(); // Actualiza todos los conteos cuando ocurra un cambio relevante
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
      ws.close();
    };
  }, []);
  const drawerWidth = 240;
  const mL = 40;
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingRight: 4,
          marginLeft: { xs: 0, sm: `${drawerWidth}px`, lg: `${mL}px` }, // Añadir margen izquierdo para que no se superponga
          padding: '1rem',
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` } // Ajuste del ancho del contenido
        }}
      >
        <h1>LISTA DE EXISTENCIAS</h1>
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          Nueva Existencia
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                >
                  Categoria
                </StyledTableCell>
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  align="right"
                >
                  Producto
                </StyledTableCell>
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  align="right"
                >
                  Proveedor
                </StyledTableCell>
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  align="right"
                >
                  Stock Inicial
                </StyledTableCell>
                <StyledTableCell align="right">Stock Actual</StyledTableCell>
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  align="right"
                >
                  Precio Compra
                </StyledTableCell>
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  align="right"
                >
                  Precio Venta
                </StyledTableCell>
                <StyledTableCell align="right">Responsable</StyledTableCell>
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {existencias.map((existencia) => (
                <StyledTableRow key={existencia.id_existencia}>
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    component="th"
                    scope="row"
                  >
                    {existencia.nombre_categoria}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    align="right"
                  >
                    {existencia.nombre_producto}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    align="right"
                  >
                    {existencia.nombre_proveedor}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    align="right"
                  >
                    {existencia.stockinicial_existencia}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {existencia.stockactual_existencia}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    align="right"
                  >
                    {existencia.preciocompra_existencia}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    align="right"
                  >
                    {existencia.precioventa_existencia}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {existencia.gestionada_por}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        handleOpenMovimiento(existencia, 'entrada')
                      }
                      sx={{ marginRight: '0.5rem' }}
                    >
                      Entrada
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenMovimiento(existencia, 'salida')}
                    >
                      Salida
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>NUEVA EXISTENCIA</DialogTitle>
          <DialogContent>
            <ExistenciaForm onClose={handleClose} onSave={cargarExistencias} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="warning">
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openMovimiento}
          onClose={handleCloseMovimiento}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {movimientoTipo === 'entrada'
              ? 'REGISTRAR ENTRADA'
              : 'REGISTRAR SALIDA'}
          </DialogTitle>
          <DialogContent>
            {selectedExistencia && (
              <MovimientoForm
                existencia={selectedExistencia}
                onClose={handleCloseMovimiento}
                onMovement={cargarExistencias}
                tipo={movimientoTipo}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseMovimiento}
              variant="contained"
              color="secondary"
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ExistenciaList;
