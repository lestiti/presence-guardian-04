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
      <div className="flex justify-center items-center bg-white rounded-lg p-8">
        <QRCode
          value={generateUniqueQRCode(userId)}
          size={200}
          level="M"
          className="h-48 w-48"
          style={{ 
            padding: '1rem',
            backgroundColor: 'white'
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-white rounded-lg p-4">
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