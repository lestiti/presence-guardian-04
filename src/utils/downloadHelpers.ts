import { toPng } from "html-to-image";
import JSZip from "jszip";
import QRCode from "react-qr-code";
import ReactBarcode from "react-barcode";
import { generateUniqueQRCode, generateUniqueBarcode } from "./codeGenerators";
import ReactDOMServer from "react-dom/server";

export const generateImage = async (element: HTMLElement, options = {}): Promise<string> => {
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

  // Wait for any images to load
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    return await toPng(element, { ...defaultOptions, ...options });
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const generateCodeImages = async (userId: string, userName: string): Promise<{ qrImage: string; barcodeImage: string }> => {
  // Create temporary containers
  const qrContainer = document.createElement('div');
  const barcodeContainer = document.createElement('div');
  
  try {
    // Style containers
    [qrContainer, barcodeContainer].forEach(container => {
      container.style.cssText = `
        position: fixed;
        left: -9999px;
        background: white;
        padding: 20px;
        width: auto;
        height: auto;
      `;
      document.body.appendChild(container);
    });

    // Render QR code
    qrContainer.innerHTML = ReactDOMServer.renderToString(
      <QRCode
        value={generateUniqueQRCode(userId)}
        size={256}
        level="H"
        includeMargin={true}
      />
    );

    // Render Barcode
    barcodeContainer.innerHTML = ReactDOMServer.renderToString(
      <ReactBarcode
        value={generateUniqueBarcode(userId)}
        height={100}
        width={2}
        displayValue={true}
        background="#ffffff"
      />
    );

    // Generate images
    const [qrImage, barcodeImage] = await Promise.all([
      generateImage(qrContainer, { width: 256, height: 256 }),
      generateImage(barcodeContainer, { width: 300, height: 100 })
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