import * as XLSX from 'xlsx';

export const generateSynodTemplate = () => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Sample data with headers and one example row
  const data = [
    {
      'NOM': 'Exemple Synode',
      'DESCRIPTION': 'Description du synode (optionnel)',
      'COULEUR': '#10B981'
    }
  ];
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Synodes");
  
  // Generate and download the file
  XLSX.writeFile(wb, 'template_synodes.xlsx');
};