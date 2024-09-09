import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { useState, useEffect } from 'react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';

function UsuarioForm({ userId, onClose, onSave }) {
  const [usuario, setUsuario] = useState({
    id_rol: '',
    nombre_usuario: '',
    clave_usuario: ''
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:4000/roles');
        const data = await response.json();
        setRoles(data.roles);
      } catch (error) {
        console.error('Error al cargar roles:', error);
      }
    };

    const fetchUsuario = async () => {
      if (userId) {
        setLoadingUser(true);
        try {
          const response = await fetch(`http://localhost:4000/users/${userId}`);
          const data = await response.json();
          setUsuario({ ...data, password: '' });
          setLoadingUser(false);
        } catch (error) {
          console.error('Error al cargar usuario:', error);
          setLoadingUser(false);
          alertify.error('Error al cargar el usuario');
        }
      }
    };

    fetchRoles();
    fetchUsuario();
  }, [userId]);

  const validateForm = () => {
    const { id_rol, nombre_usuario, clave_usuario } = usuario;

    if (!id_rol) {
      alertify.error('Debe seleccionar un rol');
      return false;
    }

    if (!nombre_usuario.trim()) {
      alertify.error('El campo nombre de usuario no debe estar vacío');
      return false;
    }

    if (!/^[A-Z][a-zA-Z]*(_[A-Z][a-zA-Z]*)*$/.test(nombre_usuario)) {
      alertify.error(
        'El nombre de usuario debe comenzar con mayúscula, no debe contener espacios y cada palabra unida por "_" debe comenzar con mayúscula'
      );
      return false;
    }

    if (
      !/(?=.*[A-Z])(?=.*\d.*\d)(?=.*[a-zA-Z]).{8,}/.test(clave_usuario)
    ) {
      alertify.error(
        'La clave debe tener al menos 8 caracteres, contener letras y números, al menos una mayúscula y dos números'
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = userId
        ? `http://localhost:4000/users/${userId}`
        : 'http://localhost:4000/users';
      const method = userId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });

      if (response.ok) {
        alertify.success(`Usuario ${userId ? 'editado' : 'creado'} correctamente`);
        await response.json();
        onSave();
        onClose();
      } else {
        const result = await response.json();
        const errorMessage = result.message || 'Error al guardar el usuario';
        alertify.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      alertify.error('Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  return (
    <Card
      sx={{
        boxShadow: 'none',
        border: 'none'
      }}
    >
      <CardContent>
        {loadingUser ? (
          <CircularProgress color="inherit" />
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl variant="filled" fullWidth>
                  <InputLabel htmlFor="rol-label">Rol</InputLabel>
                  <Select
                    variant="filled"
                    fullWidth
                    id="rol-label"
                    name="id_rol"
                    value={usuario.id_rol || ''}
                    onChange={handleChange}
                    inputProps={{ style: { color: 'black' } }}
                  >
                    {roles.map((rol) => (
                      <MenuItem key={rol.id_rol} value={rol.id_rol}>
                        {rol.nombre_rol}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  label="Nombre Usuario"
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  name="nombre_usuario"
                  value={usuario.nombre_usuario || ''}
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  label="Clave"
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  name="clave_usuario"
                  type="password"
                  value={usuario.clave_usuario || ''}
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              style={{ marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                'Guardar'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default UsuarioForm;
