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
    width: 300,
    height: 300,
    style: {
      margin: '20px',
      padding: '20px',
      backgroundColor: '#ffffff',
    }
  };

  try {
    // Force white background
    element.style.backgroundColor = '#ffffff';
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
    // Style containers with explicit white background
    qrContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffffff;
      padding: 20px;
      width: 300px;
      height: 300px;
    `;
    
    barcodeContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffffff;
      padding: 20px;
      width: 300px;
      height: 150px;
    `;

    // Generate QR code
    const qrValue = generateUniqueQRCode(userId);
    const qrElement = createElement(QRCode, {
      value: qrValue,
      size: 256,
      level: "L",
      style: {
        width: '100%',
        height: 'auto',
        maxWidth: '256px',
        backgroundColor: '#ffffff',
        padding: '20px'
      }
    });
    qrContainer.innerHTML = ReactDOMServer.renderToString(qrElement);

    // Generate barcode
    const barcodeValue = generateUniqueBarcode(userId);
    const barcodeElement = createElement(ReactBarcode, {
      value: barcodeValue,
      height: 100,
      width: 2,
      displayValue: true,
      background: "#ffffff",
      format: "CODE128",
      textAlign: "center",
      textPosition: "bottom",
      textMargin: 8,
      margin: 20
    });
    barcodeContainer.innerHTML = ReactDOMServer.renderToString(barcodeElement);

    // Generate images with explicit white background
    const [qrImage, barcodeImage] = await Promise.all([
      generateImage(qrContainer),
      generateImage(barcodeContainer)
    ]);

    return { qrImage, barcodeImage };
  } catch (error) {
    console.error("Erreur lors de la génération des images:", error);
    throw error;
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