import { toPng } from "html-to-image";
import QRCode from "react-qr-code";
import ReactBarcode from "react-barcode";
import { generateUniqueQRCode, generateUniqueBarcode } from "./codeGenerators";
import { createElement } from 'react';
import ReactDOMServer from "react-dom/server";
import { useSynodStore } from "@/stores/synodStore";

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
    // Force white background and ensure proper rendering
    element.style.backgroundColor = '#ffffff';
    element.style.display = 'flex';
    element.style.justifyContent = 'center';
    element.style.alignItems = 'center';
    
    // Wait a bit for the rendering
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return await toPng(element, options);
  } catch (error) {
    console.error("Erreur lors de la génération de l'image:", error);
    throw error;
  }
};

export const generateCodeImages = async (userId: string, userName: string, synodId?: string): Promise<{ qrImage: string; barcodeImage: string }> => {
  const qrContainer = document.createElement('div');
  const barcodeContainer = document.createElement('div');
  
  try {
    // Get synod color
    const { synods } = useSynodStore.getState();
    const synodColor = synods.find(s => s.id === synodId)?.color || '#000000';

    // Style containers with explicit white background and proper dimensions
    qrContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffffff;
      padding: 20px;
      width: 300px;
      height: 300px;
      position: fixed;
      left: -9999px;
    `;
    
    barcodeContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffffff;
      padding: 20px;
      width: 300px;
      height: 150px;
      position: fixed;
      left: -9999px;
    `;

    // Add containers to document body
    document.body.appendChild(qrContainer);
    document.body.appendChild(barcodeContainer);

    // Generate QR code
    const qrValue = generateUniqueQRCode(userId);
    const qrElement = createElement(QRCode, {
      value: qrValue,
      size: 256,
      level: "L",
      fgColor: synodColor,
      style: {
        width: '100%',
        height: 'auto',
        maxWidth: '256px',
        backgroundColor: '#ffffff',
        padding: '20px'
      }
    });
    qrContainer.innerHTML = ReactDOMServer.renderToString(qrElement);

    // Generate barcode with specific dimensions matching the preview
    const barcodeValue = generateUniqueBarcode(userId);
    const barcodeElement = createElement(ReactBarcode, {
      value: barcodeValue,
      height: 80,
      width: 1.5,
      displayValue: true,
      background: "#ffffff",
      lineColor: synodColor,
      format: "CODE128",
      textAlign: "center",
      textPosition: "bottom",
      textMargin: 8,
      margin: 10,
      fontSize: 14
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
  } finally {
    // Clean up
    if (qrContainer.parentNode) qrContainer.parentNode.removeChild(qrContainer);
    if (barcodeContainer.parentNode) barcodeContainer.parentNode.removeChild(barcodeContainer);
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