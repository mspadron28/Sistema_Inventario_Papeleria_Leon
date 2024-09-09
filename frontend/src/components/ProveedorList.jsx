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
import ProveedorForm from './ProveedorForm.jsx';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';

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

function ProveedorList() {
  const [proveedores, setProveedores] = useState([]);
  const [open, setOpen] = useState(false);
  const [editProveedorId, setEditProveedorId] = useState(null);

  const cargarProveedores = async () => {
    try {
      const response = await fetch('http://localhost:4000/proveedores');
      const data = await response.json();
      if (Array.isArray(data.proveedores)) {
        setProveedores(data.proveedores);
      } else {
        console.error('Los datos del proveedor no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      alertify.error('Error al cargar proveedores');
    }
  };

  const handleDelete = async (id) => {
    alertify.confirm(
      'Eliminar Proveedor',
      '¿Está seguro de que desea eliminar este proveedor?',
      async function () {
        try {
          const response = await fetch(
            `http://localhost:4000/proveedores/${id}`,
            {
              method: 'DELETE'
            }
          );

          if (response.ok) {
            setProveedores(
              proveedores.filter((proveedor) => proveedor.id_proveedor !== id)
            );
            alertify.success('Proveedor eliminado correctamente');
          } else {
            const result = await response.json();
            const errorMessage =
              result.message || 'Error al eliminar el proveedor';
            if (errorMessage.includes('violates foreign key constraint')) {
              alertify.error(
                'El proveedor no puede ser eliminado, está relacionado con otras tablas'
              );
            } else {
              alertify.error(errorMessage);
            }
          }
        } catch (error) {
          console.error('Error al eliminar proveedor:', error);
          alertify.error('Error al eliminar proveedor');
        }
      },
      function () {
        alertify.error('Cancelado');
      }
    );
  };

  const handleOpen = (id = null) => {
    setEditProveedorId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setEditProveedorId(null);
    setOpen(false);
  };

  useEffect(() => {
    cargarProveedores();
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
        <h1>LISTA DE PROVEEDORES</h1>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpen()}
        >
          NUEVO PROVEEDOR
        </Button>

        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table sx={{ minWidth: 300 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {/* Siempre visible */}
                <StyledTableCell>Nombre</StyledTableCell>
                {/* Visible solo en pantallas medianas o más grandes */}
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  align="right"
                >
                  Correo
                </StyledTableCell>
                {/* Siempre visible */}
                <StyledTableCell align="right">Telefono</StyledTableCell>
                {/* Siempre visible */}
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proveedores.map((proveedor) => (
                <StyledTableRow key={proveedor.id_proveedor}>
                  {/* Siempre visible */}
                  <StyledTableCell component="th" scope="row">
                    {proveedor.nombre_proveedor}
                  </StyledTableCell>
                  {/* Visible solo en pantallas medianas o más grandes */}
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    align="right"
                  >
                    {proveedor.correo_proveedor}
                  </StyledTableCell>
                  {/* Siempre visible */}
                  <StyledTableCell align="right">
                    {proveedor.telefono}
                  </StyledTableCell>
                  {/* Siempre visible */}
                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#FFA000',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#FFA001'
                        }
                      }}
                      onClick={() => handleOpen(proveedor.id_proveedor)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(proveedor.id_proveedor)}
                      sx={{ marginLeft: '.5rem' }}
                    >
                      Eliminar
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editProveedorId ? 'EDITAR PROVEEDOR' : 'CREAR PROVEEDOR'}
          </DialogTitle>
          <DialogContent>
            <ProveedorForm
              proveedorId={editProveedorId}
              onClose={handleClose}
              onSave={cargarProveedores}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="warning">
              CANCELAR
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ProveedorList;
