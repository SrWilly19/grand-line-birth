import fs from 'fs';

// 1. Leer el archivo CSV original
const csvContent = fs.readFileSync('Datos proyecto One Piece Capitulos - Hoja 1.csv', 'utf-8');

// 2. Romper el archivo en líneas
const lineas = csvContent.split(/\r?\n/);

let tomoActual = "";
let arcoActual = "";
const resultadoJSON = [];

// 3. Recorrer las líneas saltándonos la cabecera (empezamos en la fila de Tomo 1)
for (let i = 2; i < lineas.length; i++) {
  const linea = lineas[i].trim();
  if (!linea) continue; // Si la línea está vacía, saltar

  // Dividir por comas (teniendo en cuenta que los títulos japoneses tienen comillas especiales)
  const columnas = linea.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

  if (columnas.length < 6) continue;

  // Limpiar campos de comillas y espacios en blanco
  const limp = (texto) => (texto ? texto.replace(/^"|"$/g, '').trim() : "");

  const tomo = limp(columnas[0]);
  const capitulo = limp(columnas[1]);
  const fecha = limp(columnas[2]);
  const tituloJap = limp(columnas[3]);
  const tituloRom = limp(columnas[4]);
  const tituloEsp = limp(columnas[5]);
  const arco = limp(columnas[6]);

  // Si no hay número de capítulo válido, saltar
  if (!capitulo || capitulo === "nan" || isNaN(capitulo)) continue;

  // Lógica de arrastre: si viene vacío, usa el último conocido
  if (tomo && tomo !== "nan") tomoActual = tomo;
  if (arco && arco !== "nan") arcoActual = arco;

  // Darle la vuelta a la fecha de DD/MM/YYYY a YYYY-MM-DD
  let fechaISO = "nan";
  if (fecha && fecha !== "nan") {
    const partes = fecha.split('/');
    if (partes.length === 3) {
      const d = partes[0].padStart(2, '0');
      const m = partes[1].padStart(2, '0');
      const y = partes[2];
      fechaISO = `${y}-${m}-${d}`;
    }
  }

  // Armar el objeto con la estructura exacta que tú quieres
  resultadoJSON.push({
    "tomo": tomoActual,
    "capitulo": parseInt(capitulo, 10),
    "fecha_lanzamiento": fechaISO,
    "titulo_japones": tituloJap,
    "titulo_romanizado": tituloRom,
    "titulo_espanol": tituloEsp,
    "arco": arcoActual
  });
}

// 4. Guardarlo directamente en tu carpeta de datos de React
fs.writeFileSync('src/data/one_piece_data.json', JSON.stringify(resultadoJSON, null, 2), 'utf-8');

console.log(`\x1b[32m%s\x1b[0m`, `¡Éxito! Se han convertido ${resultadoJSON.length} capítulos con el formato exacto.`);