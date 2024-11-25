import { toPng } from "html-to-image";
import QRCode from "react-qr-code";
import ReactBarcode from "react-barcode";
import { generateUniqueQRCode, generateUniqueBarcode } from "./codeGenerators";
import { createElement } from 'react';
import ReactDOMServer from "react-dom/server";

const generateImage = async (element: HTMLElement): Promise<string> => {
  const options = {
    quality: 0.95,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    style: {
      margin: '20px',
      padding: '20px',
      backgroundColor: '#ffffff',
    }
  };

  // Wait for any potential rendering
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    return await toPng(element, options);
  } catch (error) {
    console.error("Erreur lors de la génération de l'image:", error);
    throw error;
  }
};

export const generateCodeImages = async (userId: string, userName: string): Promise<{ qrImage: string; barcodeImage: string }> => {
  const qrContainer = document.createElement('div');
  const barcodeContainer = document.createElement('div');
  
  try {
    // Style containers
    [qrContainer, barcodeContainer].forEach(container => {
      container.style.cssText = `
        display: inline-block;
        background: white;
        padding: 20px;
        margin: 10px;
      `;
      document.body.appendChild(container);
    });

    // Generate QR code
    const qrValue = generateUniqueQRCode(userId);
    qrContainer.innerHTML = ReactDOMServer.renderToString(
      createElement(QRCode, {
        value: qrValue,
        size: 256,
        level: "H",
      })
    );

    // Generate barcode
    const barcodeValue = generateUniqueBarcode(userId);
    barcodeContainer.innerHTML = ReactDOMServer.renderToString(
      createElement(ReactBarcode, {
        value: barcodeValue,
        height: 100,
        width: 2,
        displayValue: true,
        background: "#ffffff",
        format: "CODE128"
      })
    );

    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 200));

    // Generate images
    const [qrImage, barcodeImage] = await Promise.all([
      generateImage(qrContainer),
      generateImage(barcodeContainer)
    ]);

    return { qrImage, barcodeImage };
  } finally {
    // Cleanup
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