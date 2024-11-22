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
      <div className="flex justify-center p-4 bg-white rounded-lg">
        <QRCode
          value={generateUniqueQRCode(userId)}
          size={128}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4 bg-white rounded-lg">
      <ReactBarcode
        value={generateUniqueBarcode(userId)}
        height={50}
        displayValue={true}
      />
    </div>
  );
};