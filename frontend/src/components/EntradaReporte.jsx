import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
  Box
} from '@mui/material';
import Navbar from './Navbar.jsx';

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

const EntradaReporte = () => {
  const [entradas, setEntradas] = useState([]);

  useEffect(() => {
    fetchEntradas();
  }, []);

  const fetchEntradas = async () => {
    try {
      const response = await fetch('http://localhost:4000/entradas');
      const data = await response.json();
      if (Array.isArray(data.entradas)) {
        const entradasUnicas = data.entradas.reduce((acc, entrada) => {
          const found = acc.find((e) => e.id_entrada === entrada.id_entrada);
          if (found) {
            found.gestionada_por += `, ${entrada.gestionada_por}`;
          } else {
            acc.push({
              ...entrada,
              gestionada_por: entrada.gestionada_por
            });
          }
          return acc;
        }, []);
        setEntradas(entradasUnicas);
      } else {
        console.error('Los datos de entradas no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar entradas:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      'ID Entrada',
      'Cantidad Entrada',
      'Fecha Entrada',
      'Categoria',
      'Proveedor',
      'Producto',
      'Gestionada por'
    ];
    const tableRows = [];

    entradas.forEach((entrada) => {
      const entradaData = [
        entrada.id_entrada,
        entrada.cantidad_entrada,
        new Date(entrada.fecha_entrada).toLocaleDateString(),
        entrada.nombre_categoria,
        entrada.nombre_proveedor,
        entrada.nombre_producto,
        entrada.gestionada_por
      ];
      tableRows.push(entradaData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text('Reporte de Entradas', 14, 15);
    doc.save('entradas_reporte.pdf');
  };
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
        <h1>REPORTE DE ENTRADAS</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={downloadPDF}
          sx={{ marginRight: '1rem' }}
        >
          Descargar PDF
        </Button>
        <Button variant="contained" color="secondary">
          <CSVLink
            data={entradas}
            filename={'entradas_reporte.csv'}
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Descargar CSV
          </CSVLink>
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table sx={{ minWidth: 300 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {/* Visible solo en pantallas medianas o más grandes */}
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                >
                  ID Entrada
                </StyledTableCell>
                {/* Siempre visible */}
                <StyledTableCell align="right">
                  Cantidad Entrada
                </StyledTableCell>
                {/* Visible solo en pantallas medianas o más grandes */}
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  align="right"
                >
                  Categoria
                </StyledTableCell>
                {/* Visible solo en pantallas medianas o más grandes */}
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  align="right"
                >
                  Proveedor
                </StyledTableCell>
                {/* Visible solo en pantallas medianas o más grandes */}
                <StyledTableCell
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  align="right"
                >
                  Producto
                </StyledTableCell>
                {/* Siempre visible */}
                <StyledTableCell align="right">Gestionada por</StyledTableCell>
                {/* Siempre visible */}
                <StyledTableCell align="right">Fecha Entrada</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entradas.map((entrada) => (
                <StyledTableRow key={entrada.id_entrada}>
                  {/* Visible solo en pantallas medianas o más grandes */}
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    component="th"
                    scope="row"
                  >
                    {entrada.id_entrada}
                  </StyledTableCell>
                  {/* Siempre visible */}
                  <StyledTableCell align="right">
                    {entrada.cantidad_entrada}
                  </StyledTableCell>
                  {/* Visible solo en pantallas medianas o más grandes */}
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    align="right"
                  >
                    {entrada.nombre_categoria}
                  </StyledTableCell>
                  {/* Visible solo en pantallas medianas o más grandes */}
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    align="right"
                  >
                    {entrada.nombre_proveedor}
                  </StyledTableCell>
                  {/* Visible solo en pantallas medianas o más grandes */}
                  <StyledTableCell
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                    align="right"
                  >
                    {entrada.nombre_producto}
                  </StyledTableCell>
                  {/* Siempre visible */}
                  <StyledTableCell align="right">
                    {entrada.gestionada_por}
                  </StyledTableCell>
                  {/* Siempre visible */}
                  <StyledTableCell align="right">
                    {new Date(entrada.fecha_entrada).toLocaleDateString()}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default EntradaReporte;
