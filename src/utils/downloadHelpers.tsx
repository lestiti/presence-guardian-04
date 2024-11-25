import { toPng } from "html-to-image";
import JSZip from "jszip";
import QRCode from "react-qr-code";
import ReactBarcode from "react-barcode";
import { generateUniqueQRCode, generateUniqueBarcode } from "./codeGenerators";
import { createElement } from 'react';
import ReactDOMServer from "react-dom/server";

interface ImageOptions {
  width?: number;
  height?: number;
  [key: string]: any;
}

const generateImage = async (element: HTMLElement, options: ImageOptions = {}): Promise<string> => {
  const defaultOptions = {
    quality: 0.95,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    width: options.width || undefined,
    height: options.height || undefined,
    style: {
      margin: '20px',
      padding: '20px',
      backgroundColor: '#ffffff',
    }
  };

  // Attendre que les images soient chargées
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    return await toPng(element, { ...defaultOptions, ...options });
  } catch (error) {
    console.error("Erreur lors de la génération de l'image:", error);
    throw error;
  }
};

export const generateCodeImages = async (userId: string, userName: string): Promise<{ qrImage: string; barcodeImage: string }> => {
  // Créer des conteneurs temporaires
  const qrContainer = document.createElement('div');
  const barcodeContainer = document.createElement('div');
  
  try {
    // Styler les conteneurs
    [qrContainer, barcodeContainer].forEach(container => {
      container.style.cssText = `
        display: inline-block;
        background: white;
        padding: 20px;
        margin: 10px;
      `;
      document.body.appendChild(container);
    });

    // Générer le QR code
    qrContainer.innerHTML = ReactDOMServer.renderToString(
      createElement(QRCode, {
        value: generateUniqueQRCode(userId),
        size: 256,
        level: "H",
      })
    );

    // Générer le code-barres
    barcodeContainer.innerHTML = ReactDOMServer.renderToString(
      createElement(ReactBarcode, {
        value: generateUniqueBarcode(userId),
        height: 100,
        width: 2,
        displayValue: true,
        background: "#ffffff",
        format: "CODE128"
      })
    );

    // Attendre que les éléments soient rendus
    await new Promise(resolve => setTimeout(resolve, 100));

    // Générer les images
    const [qrImage, barcodeImage] = await Promise.all([
      generateImage(qrContainer),
      generateImage(barcodeContainer)
    ]);

    return { qrImage, barcodeImage };
  } finally {
    // Nettoyage
    [qrContainer, barcodeContainer].forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
  }
};

export const downloadZipFile = async (content: Blob, filename: string) => {
  const url = window.URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};