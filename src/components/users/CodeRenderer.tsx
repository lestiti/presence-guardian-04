import React from 'react';
import QRCode from 'react-qr-code';
import ReactBarcode from 'react-barcode';
import { generateUniqueQRCode, generateUniqueBarcode } from '@/utils/codeGenerators';
import { useSynodStore } from '@/stores/synodStore';

interface CodeRendererProps {
  userId: string;
  type: 'qr' | 'barcode';
  synodId?: string;
}

export const CodeRenderer = ({ userId, type, synodId }: CodeRendererProps) => {
  const { synods } = useSynodStore();
  const synodColor = synods.find(s => s.id === synodId)?.color || '#000000';

  if (type === 'qr') {
    return (
      <div className="flex justify-center items-center bg-white p-4">
        <QRCode
          value={generateUniqueQRCode(userId)}
          size={200}
          level="L"
          fgColor={synodColor}
          style={{ 
            height: "auto",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: 'white'
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-white p-4">
      <ReactBarcode
        value={generateUniqueBarcode(userId)}
        height={100}
        width={2}
        displayValue={true}
        background="#ffffff"
        lineColor={synodColor}
        format="CODE128"
        textAlign="center"
        textPosition="bottom"
        textMargin={8}
        margin={20}
      />
    </div>
  );
};