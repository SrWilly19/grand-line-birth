import React, { useState, useRef } from 'react';
import capitulosData from './data/one_piece_data.json'; 
import { Analytics } from '@vercel/analytics/react';
import AdsterraBanner from './AdsterraBanner';

export default function App() {
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [resultado, setResultado] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [imagenAmpliada, setImagenAmpliada] = useState(null); // Estado para controlar el Zoom
  const [mostrarColumnaColor, setMostrarColumnaColor] = useState(true);
  const [language, setLanguage] = useState('es'); // 'es' para español, 'en' para inglés
  
  // Referencia para el scroll automático
  const resultadoRef = useRef(null);

  const capitulosTradicionales = [
    1, 12, 25, 28, 32, 38, 41, 44, 45, 47, 49, 52, 56, 61, 64, 69, 70, 79, 86, 94, 100, 103, 107, 111, 117,
    128, 133, 137, 140, 144, 152, 156, 160, 165, 175, 186, 194, 198, 201, 213, 221, 226, 241, 246, 254, 260, 269, 274, 284, 287, 293,
    304, 310, 317, 327, 334, 352, 357, 364, 369, 373, 377, 379, 383, 387, 391, 394, 401, 405, 410, 415, 422, 426, 431, 439, 446, 449, 454, 
    457, 464, 471, 483, 489, 503, 507, 516, 520, 526, 532, 537, 540, 547, 553, 566, 567, 578, 582, 588, 595, 598, 604, 609, 618, 622, 628,
    634, 642, 651, 660, 664, 676, 685, 691, 692, 693, 699, 703, 707, 710, 717, 724, 726, 733, 741, 745, 750, 756, 764, 771, 775, 779, 784, 790, 
    796, 802, 809, 811, 817, 821, 824, 829, 832, 833, 835, 843, 848, 851, 858, 863, 872, 874, 878, 886, 890, 900, 902, 911, 912, 916, 921, 929,
    937, 941, 945, 949, 951, 957, 967, 972, 976, 981, 985, 987, 992, 999, 1000, 1006, 1009, 1011, 1019, 1028, 1031, 1036, 1039, 1045, 1047, 1053,
    1055, 1060, 1065, 1071, 1076, 1081, 1084, 1086, 1088, 1091, 1094, 1101, 1103, 1108, 1111, 1113, 1121, 1128, 1134, 1143, 1149, 1155, 1156,
    1161, 1166, 1169, 1176, 1183
  ];

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
      setMostrarColumnaColor(true);
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
      rutaColor = `/assets/portadas/capitulos-color/${resultado.capitulo} CD.webp`;
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
          {language === 'es' ? 'Grand Line Birth 🏴‍☠️' : 'Grand Line Birth 🏴‍☠️'} 
          {/* Nota: Si el título es el mismo en ambos idiomas, puedes dejarlo tal cual, o cambiarlo por otra frase si quieres */}
        </h1>
        <p className="text-slate-400 text-sm md:text-base mt-3 font-medium">
          {language === 'es' 
            ? 'Descubre qué capítulo del manga se publicó el día que naciste y consigue tu tomo oficial de forma legal.' 
            : 'Discover which manga chapter was published on the day you were born and find your official volume.'}
        </p>
      </header>

      {/* Tarjeta Principal */}
      <main className="w-full max-w-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl shadow-black/50">
        {/* Selector de Idioma */}
          <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs border border-slate-700 transition-all shadow-md active:scale-95"
            >
              {language === 'es' ? '🌐 English' : '🌐 Español'}
            </button>
          </div>

        {/* Formulario de Entrada */}
        <form onSubmit={buscarCapituloCercano} className="space-y-4 max-w-md mx-auto">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {language === 'es' ? 'Introduce tu fecha de nacimiento' : 'Enter your date of birth'}
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
                  {language === 'es' ? 'Navegando...' : 'Sailing...'}
                </span>
              ) : (language === 'es' ? 'Buscar Match' : 'Find Match')}
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
               {language === 'es' ? `Capítulo ${resultado.capitulo}` : `Chapter ${resultado.capitulo}`}
              </h2>
              <p className="text-amber-500 font-bold text-lg italic mt-1">
                "{language === 'es' ? resultado.titulo_espanol : (resultado.titulo_ingles || resultado.titulo_espanol)}"
              </p>
              <p className="text-slate-500 text-xs font-semibold mt-2 uppercase tracking-wide">
                {language === 'es' ? 'Publicado el: ' : 'Published on: '}
                {new Date(resultado.fecha_lanzamiento).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
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

            {/* Malla de Portadas Interactiva (Detecta si hay 2 o 3 imágenes disponibles) */}
              <div className={`grid grid-cols-1 ${mostrarColumnaColor ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-6 pt-4`}>
                
                {/* Columna 1: Portada Tradicional / B&W (Siempre existe) */}
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

                {/* Columna 2: Portada Digital Color (Se autodestruye si el capítulo no la tiene) */}
                {mostrarColumnaColor && (
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center h-4 flex items-center justify-center">
                      {etiquetaColumna2}
                    </span>
                    <div 
                      onClick={() => setImagenAmpliada(rutaColor)}
                      className="aspect-[3/4] w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center cursor-zoom-in group relative"
                    >
                      <img 
                        src={rutaColor} 
                        alt={etiquetaColumna2} 
                        onError={() => {
                          // 🔥 AQUÍ ESTÁ EL TRUCO: Si la imagen no existe en tu carpeta public,
                          // en lugar de mostrar el fondo gris de error, desactivamos este estado.
                          setMostrarColumnaColor(false);
                        }} 
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80" 
                      />
                      <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">🔍 Ampliar</span>
                    </div>
                  </div>
                )}

                {/* Columna 3: Portada del Tomo Físico (Siempre existe) */}
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center h-4 flex items-center justify-center">
                    {language === 'es' ? `Portada del ${resultado.tomo}` : `${resultado.tomo} Cover`}
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
                  <h4 className="text-sm font-bold text-slate-200">{language === 'es' ? '¿Quieres este Tomo en tu estantería?' : 'Want this Volume on your shelf?'}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'es' 
                      ? 'Hazte con el volumen físico oficial que incluye este capítulo directamente en Amazon.' 
                      : 'Get the official physical volume that includes this chapter directly on Amazon.'}
                  </p>
                </div>
                <a
                  href={language === 'es' 
                    ? `https://www.amazon.es/s?k=one+piece+manga+tomo+${numeroTomoLimpio}&tag=grandlinebirt-21`
                    : `https://www.amazon.com/s?k=one+piece+manga+volume+${numeroTomoLimpio}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 px-6 rounded-xl transition-all w-full shadow-md active:scale-[0.99]"
                >
                  {language === 'es' 
                    ? `Comprar ${resultado.tomo} en Amazon 📦` 
                    : `Buy ${resultado.tomo} on Amazon 📦`}
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
              {language === 'es' ? '✕ Cerrar' : '✕ Close'}
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
      <footer className="mt-8 w-full max-w-2xl text-center space-y-4"> 
        {/* Botón de Cómprame un café */}
          <div className="flex justify-center">
            <a 
              href="https://ko-fi.com/jeffeldependiente" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-full text-xs tracking-wide transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              {language === 'es' ? '☕ ¿Te ha gustado? ¡Invítame a un café!' : '☕ Liked it? Buy me a coffee!'}
            </a>
          </div>
        <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-xl p-4 min-h-[150px] flex items-center justify-center">
          <AdsterraBanner />
            <a 
              href="https://www.tiktok.com/@eldependientedecomics" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-slate-900/50 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5"
            >
              📱 {language === 'es' ? 'TikTok (OP)' : 'TikTok (OP)'}
            </a>
            <a 
              href="https://www.instagram.com/narutotcg_es?igsh=MWVrYjBtMGxtdnNzbg%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-slate-900/50 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5"
            >
              🥷 {language === 'es' ? 'Instagram (Naruto)' : 'Instagram (Naruto)'}
            </a>
            <a 
              href="https://www.youtube.com/@eldependientedecomics" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-slate-900/50 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5"
            >
              📸 Youtube
            </a>
        </div>

        {/* Enlace de Política de Privacidad obligado por Google */}
          <div className="pt-2">
            <a 
              href="/privacidad.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-400 text-[11px] underline transition-colors"
            >
              {language === 'es' ? 'Política de Privacidad y Cookies' : 'Privacy Policy & Cookies'}
            </a>
          </div>
      </footer>
      {/*Contador de vercel analytics*/}
        <Analytics />
    </div>
  );
}
