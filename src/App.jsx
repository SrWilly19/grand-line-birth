import React, { useState, useRef } from 'react';
import capitulosData from './data/one_piece_data.json'; 

export default function App() {
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [resultado, setResultado] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [imagenAmpliada, setImagenAmpliada] = useState(null); // Estado para controlar el Zoom
  
  // Referencia para el scroll automático
  const resultadoRef = useRef(null);

  const capitulosTradicionales = [1, 12, 25, 28, 32, 38, 41, 44, 45, 49, 52, 56, 61, 64, 69, 70, 79, 86, 94, 100];

  const buscarCapituloCercano = (e) => {
    e.preventDefault();
    if (!fechaNacimiento) return;

    setBuscando(true);

    // Simulamos un micro-retraso de 600ms para mejorar la experiencia de usuario (UX)
    setTimeout(() => {
      const fechaUsuario = new Date(fechaNacimiento);
      let capituloMasCercano = null;
      let diferenciaMinima = Infinity;

      capitulosData.forEach((cap) => {
        const fechaCapitulo = new Date(cap.fecha_lanzamiento);
        const diferencia = Math.abs(fechaUsuario - fechaCapitulo);

        if (diferencia < diferenciaMinima) {
          diferenciaMinima = diferencia;
          capituloMasCercano = cap;
        }
      });

      setResultado(capituloMasCercano);
      setBuscando(false);
      
      // Scroll suave hacia los resultados
      setTimeout(() => {
        resultadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 600);
  };

  // Función de Producción: Si una imagen falla, carga una por defecto o la oculta limpiamente
  const handleImageError = (e) => {
    e.target.onerror = null; // Evita bucle infinito
    e.target.src = 'https://placehold.co/300x400/0f172a/f59e0b?text=One+Piece';
  };

  let rutaTomo = '';
  let rutaBN = '';
  let rutaColor = '';
  let numeroTomoLimpio = '';

  // Variables dinámicas de UX
  let etiquetaColumna1 = 'Portada Cap. (B/N)';
  let etiquetaColumna2 = 'Portada Cap. (Color)';
  let notaInformativa = '';

  if (resultado) {
    numeroTomoLimpio = resultado.tomo.replace('Tomo ', '');
    rutaTomo = `/assets/portadas/tomos/${numeroTomoLimpio}.webp`;

    const esTradicional = capitulosTradicionales.includes(resultado.capitulo);
    
    if (esTradicional) {
      etiquetaColumna1 = 'Arte Tradicional 🎨';
      etiquetaColumna2 = 'Coloreado Digital 🖥️';
      notaInformativa = '✨ Nota: Este capítulo especial fue dibujado originalmente a todo color por Eiichiro Oda para la Shonen Jump, por lo que no existe versión nativa en blanco y negro.';
      
      rutaBN = `/assets/portadas/capitulos-bn/T${resultado.capitulo}.webp`;
      rutaColor = `/assets/portadas/capitulos-color/${resultado.capitulo} Coloreado Digital.webp`;
    } else {
      rutaBN = `/assets/portadas/capitulos-bn/${resultado.capitulo}.webp`;
      rutaColor = `/assets/portadas/capitulos-color/${resultado.capitulo}.webp`;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Encabezado */}
      <header className="text-center mb-8 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-black text-amber-500 tracking-wider uppercase">
          Grand Line Birth 🏴‍☠️
        </h1>
        <p className="text-slate-400 text-sm md:text-base mt-3 font-medium">
          Descubre qué capítulo del manga se publicó el día que naciste y consigue tu tomo oficial de forma legal.
        </p>
      </header>

      {/* Tarjeta Principal */}
      <main className="w-full max-w-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl shadow-black/50">
        
        {/* Formulario de Entrada */}
        <form onSubmit={buscarCapituloCercano} className="space-y-4 max-w-md mx-auto">
          <label className="block text-xs font-bold uppercase tracking-widest text-amber-500/80 text-center">
            Introduce tu fecha de nacimiento
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-center"
              required
            />
            <button
              type="submit"
              disabled={buscando}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-black uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] whitespace-nowrap min-w-[150px] flex items-center justify-center"
            >
              {buscando ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Navegando...
                </span>
              ) : "Buscar Match"}
            </button>
          </div>
        </form>

        {/* Bloque de Resultados */}
        {resultado && !buscando && (
          <div ref={resultadoRef} className="mt-8 pt-8 border-t border-slate-800/80 space-y-8">
            
            {/* Cabecera del resultado */}
            <div className="text-center">
              <span className="bg-amber-500/10 text-amber-400 text-xs font-black px-4 py-1.5 rounded-full uppercase border border-amber-500/20 tracking-wider">
                {resultado.arco}
              </span>
              <h2 className="text-3xl font-black mt-4 text-white tracking-tight">
                Capítulo {resultado.capitulo}
              </h2>
              <p className="text-amber-500 font-bold text-lg italic mt-1">
                "{resultado.titulo_espanol}"
              </p>
              <p className="text-slate-500 text-xs font-semibold mt-2 uppercase tracking-wide">
                Publicado el: {new Date(resultado.fecha_lanzamiento).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>

            {/* 💡 AVISO DE UX CONDICIONAL: Solo aparece si hay una nota descriptiva */}
            {notaInformativa && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 text-center max-w-xl mx-auto">
                <p className="text-xs text-amber-400/90 font-medium leading-relaxed">
                  {notaInformativa}
                </p>
              </div>
            )}

            {/* Malla de Portadas Interactiva */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              
              {/* Columna 1 Dinámica */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center h-4 flex items-center justify-center">
                  {etiquetaColumna1}
                </span>
                <div 
                  onClick={() => setImagenAmpliada(rutaBN)}
                  className="aspect-[3/4] w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center cursor-zoom-in group relative"
                >
                  <img src={rutaBN} alt={etiquetaColumna1} onError={handleImageError} className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80" />
                  <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">🔍 Ampliar</span>
                </div>
              </div>

              {/* Columna 2 Dinámica */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center h-4 flex items-center justify-center">
                  {etiquetaColumna2}
                </span>
                <div 
                  onClick={() => setImagenAmpliada(rutaColor)}
                  className="aspect-[3/4] w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center cursor-zoom-in group relative"
                >
                  <img src={rutaColor} alt={etiquetaColumna2} onError={handleImageError} className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80" />
                  <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">🔍 Ampliar</span>
                </div>
              </div>

              {/* Portada del Tomo Físico */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center h-4 flex items-center justify-center">
                  Portada del {resultado.tomo}
                </span>
                <div 
                  onClick={() => setImagenAmpliada(rutaTomo)}
                  className="aspect-[3/4] w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center cursor-zoom-in group relative"
                >
                  <img src={rutaTomo} alt="Portada Tomo" onError={handleImageError} className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80" />
                  <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">🔍 Ampliar</span>
                </div>
              </div>

            </div>

            {/* 💸 MONETIZACIÓN */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-center max-w-md mx-auto space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-200">¿Quieres este Tomo en tu estantería?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hazte con el volumen físico oficial que incluye este capítulo directamente en Amazon.
                </p>
              </div>
              <a
                href={`https://www.amazon.es/s?k=one+piece+volumen+${numeroTomoLimpio}&tag=TU_TAG_AFILIADO`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 px-6 rounded-xl transition-all w-full shadow-md active:scale-[0.99]"
              >
                Comprar {resultado.tomo} en Amazon 📦
              </a>
            </div>

          </div>
        )}
      </main>

      {/* MODAL DE ZOOM FLOTANTE */}
      {imagenAmpliada && (
        <div 
          onClick={() => setImagenAmpliada(null)} 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-md w-full max-h-[85vh] flex items-center justify-center">
            <button 
              onClick={() => setImagenAmpliada(null)}
              className="absolute -top-12 right-0 text-white hover:text-amber-500 text-sm font-bold bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 transition-all"
            >
              ✕ Cerrar
            </button>
            <img 
              src={imagenAmpliada} 
              alt="Portada ampliada" 
              onError={handleImageError}
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl border border-slate-800"
            />
          </div>
        </div>
      )}

      {/* Publicidad */}
      <footer className="mt-8 w-full max-w-2xl text-center">
        <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-xl p-3 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Espacio publicitario estratégico (Google AdSense / Ezoic)
        </div>
      </footer>
    </div>
  );
}