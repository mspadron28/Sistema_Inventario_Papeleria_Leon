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
import UsuarioForm from './UsuarioForm.jsx';
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

function UsuarioList() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:4000/users');
      const data = await response.json();
      if (Array.isArray(data.usuarios)) {
        setUsuarios(data.usuarios);
      } else {
        console.error('Los datos de usuarios no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const cargarRoles = async () => {
    try {
      const response = await fetch('http://localhost:4000/roles');
      const data = await response.json();
      if (Array.isArray(data.roles)) {
        setRoles(data.roles);
      } else {
        console.error('Los datos de roles no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

  const getRolNombre = (idRol) => {
    const rol = roles.find((rol) => rol.id_rol === idRol);
    return rol ? rol.nombre_rol : 'Desconocido';
  };

  const handleDelete = async (id) => {
    alertify.confirm("Eliminar Usuario", "¿Está seguro de que desea eliminar este usuario?",
      async function () {
        try {
          const response = await fetch(`http://localhost:4000/users/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            setUsuarios(usuarios.filter((usuario) => usuario.id_usuario !== id));
            alertify.success('Usuario eliminado correctamente');
          } else {
            const result = await response.json();
            const errorMessage = result.message || 'Error al eliminar el usuario';
            if (errorMessage.includes('violates foreign key constraint')) {
              alertify.error('El usuario no puede ser eliminado, está relacionado con otras tablas');
            } else {
              alertify.error(errorMessage);
            }
          }
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          alertify.error('Error al eliminar el usuario');
        }
      },
      function () {
        alertify.error('Cancelado');
      });
  };

  const handleOpen = (id = null) => {
    setEditUserId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setEditUserId(null);
    setOpen(false);
  };

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
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
        <h1>LISTA DE USUARIOS</h1>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpen()}
          sx={{ marginBottom: { xs: 2, md: 0 } }}
        >
          NUEVO USUARIO
        </Button>

        <TableContainer component={Paper} sx={{ marginTop: '1rem', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 300 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell align="right">Rol</StyledTableCell>
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <StyledTableRow key={usuario.id_usuario}>
                  <StyledTableCell component="th" scope="row">
                    {usuario.nombre_usuario}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {getRolNombre(usuario.id_rol)}
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
                      onClick={() => handleOpen(usuario.id_usuario)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(usuario.id_usuario)}
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
            {editUserId ? 'EDITAR USUARIO' : 'CREAR USUARIO'}
          </DialogTitle>
          <DialogContent>
            <UsuarioForm
              userId={editUserId}
              onClose={handleClose}
              onSave={cargarUsuarios}
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

export default UsuarioList;
