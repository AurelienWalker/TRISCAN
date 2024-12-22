import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser';

const ScannerZxing = ({ onDetected }) => {
  const videoRef = useRef(null); // Référence pour la vidéo
  const codeReader = useRef(null); // Référence pour l'instance du scanner
  const activeDeviceId = useRef(null); // Référence pour garder trace du périphérique actif

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();

    // Configuration du scanner
    codeReader.current
      .decodeFromVideoDevice(
        null, // Utilise le périphérique par défaut
        videoRef.current, // Cible le flux vidéo
        (result, error) => {
          if (result) {
            console.log("Code détecté :", result.text);
            onDetected(result.text); // Callback pour transmettre le code détecté
          }
          if (error && !(error.name === 'NotFoundException')) {
            console.error("Erreur du scanner :", error);
          }
        },
        {
          fps: 10, // Limite à 10 images par seconde
          qrbox: { width: 300, height: 100 }, // Zone de scan optimisée pour les codes-barres
          formats: [
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.UPC_A,
            BarcodeFormat.UPC_E,
          ], // Formats pris en charge
        }
      )
      .then((deviceId) => {
        activeDeviceId.current = deviceId; // Enregistre l'ID du périphérique
      })
      .catch((err) => {
        console.error("Erreur lors de l'initialisation du scanner :", err);
      });

    // Nettoyage lors du démontage
    return () => {
      if (activeDeviceId.current) {
        codeReader.current
          .decodeFromVideoDevice(null, videoRef.current) // Arrête le scanner
          .catch((err) => {
            console.error("Erreur lors de l'arrêt du scanner :", err);
          });
      }
    };
  }, [onDetected]);

  return (
    <div>
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: 'auto',
          border: '1px solid #ccc',
          borderRadius: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        muted
        playsInline
        autoPlay
      />
    </div>
  );
};

export default ScannerZxing;