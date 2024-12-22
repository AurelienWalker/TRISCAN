import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

const Scanner = ({ onDetected }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: scannerRef.current,
            constraints: {
              width: 640,
              height: 480,
              facingMode: 'environment', // Caméra arrière
            },
          },
          decoder: {
            readers: ['ean_reader'], // Format EAN-13
          },
          locator: {
            patchSize: 'medium', // Taille des zones analysées : small, medium, large
            halfSample: true,    // Réduit la résolution pour améliorer la vitesse
          },
          locate: true, // Active la localisation des codes-barres même flous
        },
        (err) => {
          if (err) {
            console.error('Erreur lors de l\'initialisation de QuaggaJS :', err);
            return;
          }
          Quagga.start();
        }
      );

      // Affichage des cadres de détection pour débogage
      Quagga.onProcessed((result) => {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

          if (result.boxes) {
            result.boxes
              .filter((box) => box !== result.box)
              .forEach((box) => {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                  color: 'green',
                  lineWidth: 2,
                });
              });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
              color: 'blue',
              lineWidth: 2,
            });
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, {
              color: 'red',
              lineWidth: 3,
            });
          }
        }
      });

      // Détection des codes-barres
      Quagga.onDetected((data) => {
        if (data && data.codeResult && data.codeResult.code) {
          onDetected(data.codeResult.code);
        }
      });

      // Nettoyage à la fin du composant
      return () => {
        Quagga.stop();
      };
    }
  }, [onDetected]);

  return (
    <div
      ref={scannerRef}
      style={{
        width: '100%',
        height: '480px',
        border: '2px solid black',
        position: 'relative',
        overflow: 'hidden',
      }}
    />
  );
};

export default Scanner;