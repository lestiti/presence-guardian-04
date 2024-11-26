import { toPng } from "html-to-image";
import QRCode from "react-qr-code";
import ReactBarcode from "react-barcode";
import { generateUniqueQRCode, generateUniqueBarcode } from "./codeGenerators";
import { createElement } from 'react';
import ReactDOMServer from "react-dom/server";
import { useSynodStore } from "@/stores/synodStore";

const generateImage = async (element: HTMLElement): Promise<string> => {
  try {
    // Ensure the element is properly styled
    element.style.backgroundColor = '#ffffff';
    element.style.display = 'flex';
    element.style.justifyContent = 'center';
    element.style.alignItems = 'center';
    element.style.padding = '20px';
    element.style.margin = '20px';
    
    // Wait for the element to be fully rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      style: {
        margin: '20px',
        padding: '20px',
      }
    });

    return dataUrl;
  } catch (error) {
    console.error("Erreur lors de la génération de l'image:", error);
    throw error;
  }
};

export const generateCodeImages = async (userId: string, userName: string, synodId?: string): Promise<{ qrImage: string; barcodeImage: string }> => {
  // Create containers that will be temporarily added to the document
  const qrContainer = document.createElement('div');
  const barcodeContainer = document.createElement('div');
  
  try {
    const { synods } = useSynodStore.getState();
    const synodColor = synods.find(s => s.id === synodId)?.color || '#000000';

    // Style containers
    const containerStyle = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      background-color: #ffffff;
      padding: 20px;
      margin: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 300px;
    `;

    qrContainer.style.cssText = containerStyle + 'height: 300px;';
    barcodeContainer.style.cssText = containerStyle + 'height: 150px;';

    // Add containers to document body
    document.body.appendChild(qrContainer);
    document.body.appendChild(barcodeContainer);

    // Generate QR code
    const qrElement = createElement(QRCode, {
      value: generateUniqueQRCode(userId),
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

    // Generate barcode
    const barcodeElement = createElement(ReactBarcode, {
      value: generateUniqueBarcode(userId),
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

    // Generate images
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
    document.body.removeChild(qrContainer);
    document.body.removeChild(barcodeContainer);
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