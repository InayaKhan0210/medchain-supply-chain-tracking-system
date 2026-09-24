const blockchain = require('./services/blockchain');

async function restore() {
  const result = await blockchain.registerMedicine({
    medicineId: 'MED-6956790F',
    name: 'Paracetamol',
    manufacturer: 'manufacturer.medchain',
    manufacturingDate: '2026-06-10T00:00:00.000Z',
    expiryDate: '2026-12-17T00:00:00.000Z',
    batchNumber: 'PCM-2026-001',
    currentLocation: 'Not specified'
  });

  console.log(result);
}

restore().catch(console.error);