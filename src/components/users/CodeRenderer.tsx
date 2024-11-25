import React from 'react';
import QRCode from 'react-qr-code';
import ReactBarcode from 'react-barcode';
import { generateUniqueQRCode, generateUniqueBarcode } from '@/utils/codeGenerators';

interface CodeRendererProps {
  userId: string;
  type: 'qr' | 'barcode';
}

export const CodeRenderer = ({ userId, type }: CodeRendererProps) => {
  if (type === 'qr') {
    return (
      <div className="flex justify-center p-4 bg-white rounded-lg shadow-sm">
        <QRCode
          value={generateUniqueQRCode(userId)}
          size={128}
          level="H"
          className="h-32 w-32"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4 bg-white rounded-lg shadow-sm">
      <ReactBarcode
        value={generateUniqueBarcode(userId)}
        height={50}
        width={2}
        displayValue={true}
        background="#ffffff"
        format="CODE128"
      />
    </div>
  );
};