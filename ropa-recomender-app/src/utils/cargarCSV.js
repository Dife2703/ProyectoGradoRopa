// src/utils/cargarCSV.js
import Papa from 'papaparse';

export const cargarCSV = async () => {
  const response = await fetch('/data/prendas.csv'); // Asegúrate de que esté accesible públicamente
  const reader = await response.text();
  return new Promise((resolve) => {
    Papa.parse(reader, {
      header: true,
      complete: (results) => resolve(results.data),
    });
  });
};