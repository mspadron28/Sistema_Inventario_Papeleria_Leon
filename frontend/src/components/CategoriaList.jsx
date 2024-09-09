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
import CategoriaForm from './CategoriaForm.jsx';

import { styled } from '@mui/material/styles';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';

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

function CategoriaList() {
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCategoriaId, setEditCategoriaId] = useState(null);

  const cargarCategorias = async () => {
    try {
      const response = await fetch('http://localhost:4000/categorias');
      const data = await response.json();
      if (Array.isArray(data.categorias)) {
        setCategorias(data.categorias);
      } else {
        console.error('Los datos del proveedor no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleDelete = async (id) => {
    alertify.confirm("Eliminar Categoría", "¿Está seguro de que desea eliminar esta categoría?",
      async function () {
        try {
          const response = await fetch(`http://localhost:4000/categorias/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            setCategorias(categorias.filter((categoria) => categoria.id_categoria !== id));
            alertify.success('Categoría eliminada correctamente');
          } else {
            const result = await response.json();
            const errorMessage = result.message || 'Error al eliminar la categoría';
            if (errorMessage.includes('violates foreign key constraint')) {
              alertify.error('La categoría no puede ser eliminada, está relacionada con un producto');
            } else {
              alertify.error(errorMessage);
            }
          }
        } catch (error) {
          console.error('Error al eliminar categoría:', error);
          alertify.error('Error al eliminar la categoría');
        }
      },
      function () {
        alertify.error('Cancelado');
      });
  };

  const handleOpen = (id = null) => {
    setEditCategoriaId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setEditCategoriaId(null);
    setOpen(false);
  };

  useEffect(() => {
    cargarCategorias();
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
             marginLeft: { xs: 0, sm: `${drawerWidth}px` , lg: `${mL}px`}, // Añadir margen izquierdo para que no se superponga
             padding: '1rem',
             width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` } // Ajuste del ancho del contenido
           }}
      >
        <h1>LISTA DE CATEGORIAS</h1>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpen()}
        >
          Nueva Categoría
        </Button>

        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table sx={{ minWidth: 300 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((categoria) => (
                <StyledTableRow key={categoria.id_categoria}>
                  <StyledTableCell component="th" scope="row">
                    {categoria.nombre_categoria}
                  </StyledTableCell>
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
                      onClick={() => handleOpen(categoria.id_categoria)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(categoria.id_categoria)}
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
            {editCategoriaId ? 'EDITAR CATEGORÍA' : 'CREAR CATEGORÍA'}
          </DialogTitle>
          <DialogContent>
            <CategoriaForm
              categoriaId={editCategoriaId}
              onClose={handleClose}
              onSave={cargarCategorias}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="warning">
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default CategoriaList;
