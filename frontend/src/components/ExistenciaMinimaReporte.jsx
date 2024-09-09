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

const ExistenciaMinimaReporte = () => {
  const [existenciasMinimas, setExistenciasMinimas] = useState([]);

  useEffect(() => {
    fetchExistenciasMinimas();
  }, []);

  const fetchExistenciasMinimas = async () => {
    try {
      const response = await fetch('http://localhost:4000/existencias/minimas');
      const data = await response.json();
      setExistenciasMinimas(data);
    } catch (error) {
      console.error('Error fetching existencias minimas:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      'ID Existencia',
      'Producto',
      'Categoría',
      'Proveedor',
      'Stock Actual'
    ];
    const tableRows = [];

    existenciasMinimas.forEach((existencia) => {
      const existenciaData = [
        existencia.id_existencia,
        existencia.nombre_producto,
        existencia.nombre_categoria,
        existencia.nombre_proveedor,
        existencia.stockactual_existencia
      ];
      tableRows.push(existenciaData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text('Reporte de Existencias Mínimas', 14, 15);
    doc.save('existencias_minimas_reporte.pdf');
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
        <h1>REPORTE DE EXISTENCIAS MÍNIMAS</h1>
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
            data={existenciasMinimas}
            filename={'existencias_minimas_reporte.csv'}
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Descargar CSV
          </CSVLink>
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table sx={{ minWidth: 100 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID Existencia</StyledTableCell>
                <StyledTableCell align="right">Producto</StyledTableCell>
                <StyledTableCell align="right">Categoria</StyledTableCell>
                <StyledTableCell align="right">Proveedor</StyledTableCell>
                <StyledTableCell align="right">Stock Actual</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {existenciasMinimas.map((existencia) => (
                <StyledTableRow key={existencia.id_existencia}>
                  <TableCell component="th" scope="row">
                    {existencia.id_existencia}
                  </TableCell>
                  <TableCell align="right">
                    {existencia.nombre_producto}
                  </TableCell>
                  <TableCell align="right">
                    {existencia.nombre_categoria}
                  </TableCell>
                  <TableCell align="right">
                    {existencia.nombre_proveedor}
                  </TableCell>
                  <TableCell align="right">
                    {existencia.stockactual_existencia}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ExistenciaMinimaReporte;
