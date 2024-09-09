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
import ProductoForm from './ProductoForm.jsx';
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
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [editProductoId, setEditProductoId] = useState(null);

  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:4000/productos');
      const data = await response.json();
      if (Array.isArray(data.productos)) {
        setProductos(data.productos);
      } else {
        console.error('Los datos de productos no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await fetch('http://localhost:4000/categorias');
      const data = await response.json();
      if (Array.isArray(data.categorias)) {
        setCategorias(data.categorias);
      } else {
        console.error('Los datos de categorías no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const getCategoriaNombre = (idCategoria) => {
    const categoria = categorias.find(
      (cat) => cat.id_categoria === idCategoria
    );
    return categoria ? categoria.nombre_categoria : 'Desconocido';
  };

  const handleDelete = async (id) => {
    alertify.confirm(
      'Eliminar Producto',
      '¿Está seguro de que desea eliminar este producto?',
      async function () {
        try {
          const response = await fetch(
            `http://localhost:4000/productos/${id}`,
            {
              method: 'DELETE'
            }
          );

          if (response.ok) {
            setProductos(
              productos.filter((producto) => producto.id_producto !== id)
            );
            alertify.success('Producto eliminado correctamente');
          } else {
            const result = await response.json();
            const errorMessage =
              result.message || 'Error al eliminar el producto';
            if (errorMessage.includes('violates foreign key constraint')) {
              alertify.error(
                'El producto no puede ser eliminado, está relacionado con otras tablas'
              );
            } else {
              alertify.error(errorMessage);
            }
          }
        } catch (error) {
          console.error('Error al eliminar producto:', error);
          alertify.error('Error al eliminar el producto');
        }
      },
      function () {
        alertify.error('Cancelado');
      }
    );
  };

  const handleOpen = (id = null) => {
    setEditProductoId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setEditProductoId(null);
    setOpen(false);
  };

  useEffect(() => {
    cargarProductos();
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
          marginLeft: { xs: 0, sm: `${drawerWidth}px`, lg: `${mL}px` }, // Añadir margen izquierdo para que no se superponga
          padding: '1rem',
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` } // Ajuste del ancho del contenido
        }}
      >
        <h1>LISTA DE PRODUCTOS</h1>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpen()}
        >
          Nuevo Producto
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
                  Precio
                </StyledTableCell>
                {/* Visible solo en pantallas medianas o más grandes */}
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  align="right"
                >
                  Fecha de Expiración
                </StyledTableCell>
                {/* Siempre visible */}
                <StyledTableCell align="right">Categoría</StyledTableCell>
                {/* Siempre visible */}
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto) => (
                <StyledTableRow key={producto.id_producto}>
                  {/* Siempre visible */}
                  <StyledTableCell component="th" scope="row">
                    {producto.nombre_producto}
                  </StyledTableCell>
                  {/* Visible solo en pantallas medianas o más grandes */}
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    align="right"
                  >
                    {producto.precio_producto}
                  </StyledTableCell>
                  {/* Visible solo en pantallas medianas o más grandes */}
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    align="right"
                  >
                    {producto.fechaexpiracion_producto}
                  </StyledTableCell>
                  {/* Siempre visible */}
                  <StyledTableCell align="right">
                    {getCategoriaNombre(producto.id_categoria)}
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
                      onClick={() => handleOpen(producto.id_producto)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(producto.id_producto)}
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
            {editProductoId ? 'EDITAR PRODUCTO' : 'CREAR PRODUCTO'}
          </DialogTitle>
          <DialogContent>
            <ProductoForm
              productoId={editProductoId}
              onClose={handleClose}
              onSave={cargarProductos}
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

export default ProductoList;
