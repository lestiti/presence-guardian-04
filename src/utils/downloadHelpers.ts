import { toPng } from "html-to-image";
import JSZip from "jszip";

export const generateImage = async (element: HTMLElement, options = {}): Promise<string> => {
  const defaultOptions = {
    quality: 0.95,
    pixelRatio: 2,
    backgroundColor: '#ffffff'
  };

  try {
    return await toPng(element, { ...defaultOptions, ...options });
  } catch (error) {
    console.error("Error generating image:", error);
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