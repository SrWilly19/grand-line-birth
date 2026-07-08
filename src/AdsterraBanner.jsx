import { useEffect, useRef } from 'react';

export default function AdsterraBanner() {
  const adRef = useRef(null);

  useEffect(() => {
    // Evita duplicar el script si el componente se renderiza dos veces
    if (adRef.current && !adRef.current.firstChild) {
      const script = document.createElement('script');
      script.src = 'https://pl30258022.effectivecpmnetwork.com/1dd213a978919321776301a7927f5fa5/invoke.js';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');

      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div 
      id="container-1dd213a978919321776301a7927f5fa5" 
      ref={adRef} 
      className="w-full flex justify-center"
    />
  );
}