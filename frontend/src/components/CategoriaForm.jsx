import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField
} from '@mui/material';
import { useState, useEffect } from 'react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';

function CategoriaForm({ categoriaId, onClose, onSave }) {
  const [categoria, setCategoria] = useState({
    nombre_categoria: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingCategoria, setLoadingCategoria] = useState(false);

  useEffect(() => {
    const fetchCategoria = async () => {
      if (categoriaId) {
        setLoadingCategoria(true);
        try {
          const response = await fetch(
            `http://localhost:4000/categorias/${categoriaId}`
          );
          const data = await response.json();
          setCategoria(data);
          setLoadingCategoria(false);
        } catch (error) {
          console.error('Error al cargar categoría:', error);
          setLoadingCategoria(false);
          alertify.error('Error al cargar la categoría');
        }
      }
    };

    fetchCategoria();
  }, [categoriaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoria.nombre_categoria.trim()) {
      alertify.error('El campo no debe estar vacío');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(categoria.nombre_categoria)) {
      alertify.error('El nombre de la categoría solo debe contener letras');
      return;
    }

    setLoading(true);
    try {
      const url = categoriaId
        ? `http://localhost:4000/categorias/${categoriaId}`
        : 'http://localhost:4000/categorias';
      const method = categoriaId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria)
      });

      if (response.ok) {
        alertify.success(`Categoría ${categoriaId ? 'editada' : 'creada'} correctamente`);
        await response.json();
        onSave();
        onClose();
      } else {
        const result = await response.json();
        const errorMessage = result.message || 'Error al guardar la categoría';
        alertify.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      alertify.error('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
  };

  return (
    <Card
      sx={{
        boxShadow: 'none',
        border: 'none'
      }}
    >
      <CardContent>
        {loadingCategoria ? (
          <CircularProgress color="inherit" />
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  label="Nombre Categoría"
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  name="nombre_categoria"
                  value={categoria.nombre_categoria || ''}
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

export default CategoriaForm;
