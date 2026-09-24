const blockchain = require('./services/blockchain');

async function restore() {
  const medicines = [
    {
      medicineId: 'MED-69251C0B',
      name: 'Azithromycin',
      manufacturer: 'manufacturer.medchain',
      manufacturingDate: '2026-09-10T00:00:00.000Z',
      expiryDate: '2027-09-23T00:00:00.000Z',
      batchNumber: 'PCM-2026-123',
      currentLocation: 'Not specified'
    },
    {
      medicineId: 'MED-93690F25',
      name: 'Paracetamol-500mg',
      manufacturer: 'manufacturer.medchain',
      manufacturingDate: '2026-09-15T00:00:00.000Z',
      expiryDate: '2028-09-15T00:00:00.000Z',
      batchNumber: 'PCM-2026-IK',
      currentLocation: 'Not specified'
    }
  ];

  for (const medicine of medicines) {
    console.log(`Registering ${medicine.name}...`);

    const result = await blockchain.registerMedicine(medicine);

    console.log(result);

    if (!result.success) {
      console.log(`Failed to register ${medicine.name}`);
    } else {
      console.log(`${medicine.name} registered successfully.`);
    }
  }
}

restore().catch(console.error);