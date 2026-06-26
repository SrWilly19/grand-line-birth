import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para obtener la carpeta actual en formato ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const carpeta = __dirname;

console.log("🏴‍☠️ ¡Cambiando el rumbo! Renombrando archivos con formato moderno...");

fs.readdir(carpeta, (err, archivos) => {
  if (err) return console.error("❌ Error al leer la carpeta:", err);

  archivos.forEach(archivo => {
    // Saltamos este propio archivo de script
    if (archivo === 'renombre.js') return;

    const rutaAbsoluta = path.join(carpeta, archivo);
    
    if (fs.lstatSync(rutaAbsoluta).isFile()) {
      // Buscamos el número del capítulo (las XXX después del guion bajo)
      const coincidenciaNumero = archivo.match(/_(\d+)/);
      
      if (coincidenciaNumero) {
        const numeroCapitulo = coincidenciaNumero[1]; // Captura exactamente el número
        const nuevoNombre = `${numeroCapitulo}.webp`;

        if (archivo !== nuevoNombre) {
          const rutaNueva = path.join(carpeta, nuevoNombre);
          
          fs.rename(rutaAbsoluta, rutaNueva, (err) => {
            if (err) console.error(`❌ Error renombrando ${archivo}:`, err);
            else console.log(`🔄 Convertido: "${archivo}"  -->  "${nuevoNombre}"`);
          });
        }
      } else {
        // Por si acaso hay algún archivo que no tenga el guion bajo pero sí números
        const numeroDirecto = archivo.match(/\d+/);
        if (numeroDirecto && archivo.endsWith('.webp')) {
          const nuevoNombre = `${numeroDirecto[0]}.webp`;
          if (archivo !== nuevoNombre) {
            fs.rename(rutaAbsoluta, path.join(carpeta, nuevoNombre), () => {});
          }
        }
      }
    }
  });
});