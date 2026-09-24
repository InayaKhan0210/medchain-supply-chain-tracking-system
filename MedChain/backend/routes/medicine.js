
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const router = express.Router();

const Medicine = require('../models/Medicine');
const VerificationHistory = require('../models/VerificationHistory');
const TransferHistory = require('../models/TransferHistory');
const blockchain = require('../services/blockchain');
const logger = require('../utils/logger');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const statusValues = [
  'Manufactured',
  'InTransit',
  'Stored',
  'Sold',
  'Expired',
  'Recalled'
];

const statusNumbers = Object.fromEntries(
  statusValues.map((value, index) => [value, index])
);

const editableFields = [
  'name',
  'batchNumber',
  'qrCodeData',
  'manufacturingDate',
  'expiryDate',
  'chemicalComponents',
  'description',
  'storageConditions',
  'dosage',
  'price',
  'quantity',
  'status'
];

function sendError(res, error, fallback = 'Request failed') {
  logger.error('api.failure', {
    error: error.message,
    code: error.code
  });

  if (error.code === 11000) {
    return res.status(409).json({
      error: 'A medicine with that unique identity already exists'
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message
    });
  }

  return res.status(500).json({
    error: fallback
  });
}


// ============================================================
// REGISTER MEDICINE
// ============================================================

router.post('/register', async (req, res) => {
  try {
    const {
      name,
      batchNumber,
      manufacturer,
      manufacturingDate,
      expiryDate,
      chemicalComponents,
      description,
      storageConditions,
      dosage,
      price,
      quantity,
      status
    } = req.body;

    if (
      !name ||
      !manufacturer ||
      !batchNumber ||
      !manufacturingDate ||
      !expiryDate ||
      !chemicalComponents
    ) {
      return res.status(400).json({
        error:
          'name, manufacturer, batch number, dates, and chemical components are required'
      });
    }

    const medicineId = `MED-${crypto
      .randomBytes(4)
      .toString('hex')
      .toUpperCase()}`;

    const qrCodeData = JSON.stringify({
      medicineId,
      batchNumber
    });

    if (new Date(manufacturingDate) >= new Date(expiryDate)) {
      return res.status(400).json({
        error: 'Manufacturing date must be before expiry date'
      });
    }

    if (
      await Medicine.exists({
        $or: [{ medicineId }, { batchNumber }]
      })
    ) {
      return res.status(409).json({
        error: 'A medicine with that medicine ID or batch already exists'
      });
    }

    logger.info('medicine.registration_started', {
      medicineId,
      batchNumber,
      manufacturer
    });

    const blockchainResult = await blockchain.registerMedicine({
      medicineId,
      name,
      manufacturer,
      manufacturingDate,
      expiryDate,
      batchNumber,
      currentLocation: storageConditions || 'Not specified'
    });

    if (!blockchainResult.success) {
      logger.error('medicine.blockchain_registration_failed', {
        batchNumber,
        error: blockchainResult.error
      });

      return res.status(503).json({
        error:
          'Medicine was not registered because the blockchain transaction failed',
        details: blockchainResult.error
      });
    }

    const medicine = await Medicine.create({
      medicineId,
      blockchainId: medicineId,
      blockchainTransactionHash: blockchainResult.transactionHash,
      blockchainBlockNumber: blockchainResult.blockNumber,
      blockchainNetwork: process.env.NETWORK || 'localhost',
      name,
      batchNumber,
      qrCodeData,
      manufacturer,
      manufacturingDate,
      expiryDate,
      chemicalComponents,
      description,
      storageConditions,
      dosage,
      price,
      quantity,
      status
    });

    logger.info('medicine.registered', {
      id: medicine._id,
      batchNumber,
      transactionHash: blockchainResult.transactionHash
    });

    res.status(201).json({
      message: 'Medicine registered successfully',
      medicine
    });
  } catch (error) {
    sendError(res, error, 'Failed to register medicine');
  }
});


// ============================================================
// VERIFICATION HISTORY
// ============================================================

router.get('/verification-history', async (req, res) => {
  try {
    const history = await VerificationHistory
      .find()
      .sort({ verifiedAt: -1 });

    res.json(history);
  } catch (error) {
    sendError(res, error, 'Failed to fetch verification history');
  }
});


// ============================================================
// GET ALL MEDICINES
// ============================================================

router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine
      .find()
      .sort({ createdAt: -1 });

    logger.info('medicine.listed', {
      count: medicines.length
    });

    res.json(medicines);
  } catch (error) {
    sendError(res, error, 'Failed to fetch medicines');
  }
});


// ============================================================
// BLOCKCHAIN HISTORY
// ============================================================

router.get('/:id/history', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        error: 'Medicine not found'
      });
    }

    const result = await blockchain.getMedicineHistory(
      medicine.batchNumber
    );

    if (!result.success) {
      return res.status(503).json({
        error: result.error
      });
    }

    res.json({
      batchNumber: medicine.batchNumber,
      history: result.history
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch blockchain history');
  }
});


// ============================================================
// DATABASE ↔ BLOCKCHAIN COMPARISON
// ============================================================

router.get('/:id/blockchain', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        error: 'Medicine not found'
      });
    }

    const result = await blockchain.getMedicine(
      medicine.batchNumber
    );

    if (!result.success) {
      return res.status(503).json({
        error: result.error
      });
    }

    res.json({
      database: medicine,
      blockchain: result.data
    });
  } catch (error) {
    sendError(
      res,
      error,
      'Failed to compare database and blockchain records'
    );
  }
});


// ============================================================
// GET MEDICINE BY DATABASE ID
// ============================================================

router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        error: 'Medicine not found'
      });
    }

    res.json(medicine);
  } catch (error) {
    sendError(res, error, 'Failed to fetch medicine');
  }
});


// ============================================================
// UPDATE MEDICINE
// ============================================================

router.put('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        error: 'Medicine not found'
      });
    }

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) =>
        editableFields.includes(key)
      )
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'No editable fields provided'
      });
    }

    if (
      updates.status &&
      !statusValues.includes(updates.status)
    ) {
      return res.status(400).json({
        error: `Status must be one of: ${statusValues.join(', ')}`
      });
    }

    // Enforce valid medicine status transitions
    if (
      updates.status &&
      updates.status !== medicine.status
    ) {
      const allowedTransitions = {
        Manufactured: ['InTransit'],
        InTransit: ['Stored'],
        Stored: ['Sold'],
        Sold: [],
        Expired: [],
        Recalled: []
      };

      const allowedNextStatuses =
        allowedTransitions[medicine.status] || [];

      if (!allowedNextStatuses.includes(updates.status)) {
        return res.status(400).json({
          error: `Invalid status transition: ${medicine.status} → ${updates.status}`
        });
      }
    }

    if (
      updates.manufacturingDate &&
      updates.expiryDate &&
      new Date(updates.manufacturingDate) >=
      new Date(updates.expiryDate)
    ) {
      return res.status(400).json({
        error: 'Manufacturing date must be before expiry date'
      });
    }

    if (
      updates.status &&
      updates.status !== medicine.status
    ) {
      const chainResult = await blockchain.updateStatus(
        medicine.batchNumber,
        statusNumbers[updates.status]
      );

      if (!chainResult.success) {
        return res.status(503).json({
          error: 'Blockchain status update failed',
          details: chainResult.error
        });
      }

      updates.blockchainTransactionHash =
        chainResult.transactionHash;

      updates.blockchainBlockNumber =
        chainResult.blockNumber;
    }

    Object.assign(medicine, updates);

    await medicine.save();

    logger.info('medicine.updated', {
      id: medicine._id,
      fields: Object.keys(updates),
      batchNumber: medicine.batchNumber
    });

    res.json({
      message: 'Medicine updated successfully',
      medicine
    });
  } catch (error) {
    sendError(
      res,
      error,
      'Failed to update medicine'
    );
  }
});


// ============================================================
// DELETE / RECALL MEDICINE
// ============================================================

router.delete('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        error: 'Medicine not found'
      });
    }

    const chainResult = await blockchain.updateStatus(
      medicine.batchNumber,
      statusNumbers.Recalled
    );

    if (!chainResult.success) {
      return res.status(503).json({
        error:
          'Medicine was not deleted because the blockchain recall failed',
        details: chainResult.error
      });
    }

    await medicine.deleteOne();

    logger.warn('medicine.deleted', {
      id: medicine._id,
      batchNumber: medicine.batchNumber,
      transactionHash: chainResult.transactionHash
    });

    res.json({
      message:
        'Medicine deleted from the database and marked Recalled on the blockchain'
    });
  } catch (error) {
    sendError(
      res,
      error,
      'Failed to delete medicine'
    );
  }
});


// ============================================================
// TRANSFER MEDICINE
// ============================================================

router.post('/:id/transfer', async (req, res) => {
  try {
    const {
      newOwner,
      newLocation,
      role,
      currentOwner
    } = req.body;

    if (
      !newOwner ||
      !newLocation ||
      !role ||
      !currentOwner
    ) {
      return res.status(400).json({
        error:
          'New owner, new location, role, and current owner are required'
      });
    }

    const allowedRoles = [
      'manufacturer',
      'distributor',
      'retailer'
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error:
          'Role must be manufacturer, distributor, or retailer'
      });
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(newOwner)) {
      return res.status(400).json({
        error:
          'New owner must be a valid Ethereum address'
      });
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(currentOwner)) {
      return res.status(400).json({
        error:
          'Current owner must be a valid Ethereum address'
      });
    }

    if (role === 'retailer') {
      return res.status(403).json({
        error: 'Retailers cannot transfer medicine'
      });
    }

    const medicine = await Medicine.findById(
      req.params.id
    );

    if (!medicine) {
      return res.status(404).json({
        error: 'Medicine not found'
      });
    }

    const roleWallets = {
      manufacturer: medicine.manufacturerWallet,
      distributor: medicine.distributorWallet,
      retailer: medicine.retailerWallet
    };

    const currentRoleWallet = roleWallets[role];

    if (!currentRoleWallet) {
      return res.status(400).json({
        error:
          `No wallet address is assigned to the ${role}`
      });
    }

    const blockchainMedicine =
      await blockchain.getMedicine(
        medicine.batchNumber
      );

    if (!blockchainMedicine.success) {
      return res.status(503).json({
        error:
          'Could not verify current blockchain owner',
        details: blockchainMedicine.error
      });
    }

    const blockchainOwner =
      blockchainMedicine.data.currentOwner;

    if (!blockchainOwner) {
      return res.status(403).json({
        error:
          'Medicine has no current blockchain owner'
      });
    }

    if (
      currentRoleWallet.toLowerCase() !==
      blockchainOwner.toLowerCase()
    ) {
      return res.status(403).json({
        error:
          'The selected role is not the current blockchain owner'
      });
    }

    if (
      currentOwner.toLowerCase() !==
      blockchainOwner.toLowerCase()
    ) {
      return res.status(403).json({
        error:
          'Submitted current owner does not match blockchain owner'
      });
    }

    const allowedRecipients = {
      manufacturer: ['distributor'],
      distributor: ['retailer'],
      retailer: []
    };

    const recipientRole =
      Object.entries(roleWallets).find(
        ([roleName, wallet]) =>
          wallet &&
          wallet.toLowerCase() ===
          newOwner.toLowerCase()
      )?.[0];

    if (!recipientRole) {
      return res.status(403).json({
        error:
          'New owner is not a registered MedChain role wallet'
      });
    }

    if (
      !allowedRecipients[role].includes(
        recipientRole
      )
    ) {
      return res.status(403).json({
        error:
          `${role} cannot transfer medicine to ${recipientRole}`
      });
    }

    const chainResult =
      await blockchain.transferMedicine(
        medicine.batchNumber,
        newOwner,
        newLocation,
        role
      );

    if (!chainResult.success) {
      return res.status(503).json({
        error: 'Blockchain transfer failed',
        details: chainResult.error
      });
    }

    await TransferHistory.create({
      medicineId: medicine._id,
      batchNumber: medicine.batchNumber,
      fromOwner: blockchainOwner,
      toOwner: newOwner,
      location: newLocation,
      transactionHash: chainResult.transactionHash,
      blockNumber: chainResult.blockNumber
    });

    medicine.blockchainTransactionHash =
      chainResult.transactionHash;

    medicine.blockchainBlockNumber =
      chainResult.blockNumber;

    await medicine.save();

    logger.info('medicine.transferred', {
      medicineId: medicine._id,
      batchNumber: medicine.batchNumber,
      fromOwner: blockchainOwner,
      toOwner: newOwner,
      newLocation,
      transactionHash:
        chainResult.transactionHash
    });

    res.json({
      message: 'Medicine transferred successfully',
      medicine,
      transactionHash:
        chainResult.transactionHash,
      blockNumber: chainResult.blockNumber
    });
  } catch (error) {
    sendError(
      res,
      error,
      'Failed to transfer medicine'
    );
  }
});


// ============================================================
// RAZORPAY - CREATE PAYMENT ORDER
// ============================================================

router.post('/payment/create-order', async (req, res) => {
  try {
    const {
      amount,
      medicineId,
      quantity
    } = req.body;

    const requestedAmount = Number(amount);
    const requestedQuantity = Number(quantity);

    if (
      !Number.isFinite(requestedAmount) ||
      requestedAmount <= 0 ||
      !medicineId ||
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return res.status(400).json({
        error:
          'Valid amount, medicine, and quantity are required'
      });
    }

    const options = {
      amount: Math.round(requestedAmount * 100),
      currency: 'INR',
      receipt: `medchain_${Date.now()}`,
      notes: {
        medicineId,
        quantity: String(requestedQuantity)
      }
    };

    const order =
      await razorpay.orders.create(options);

    res.status(201).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error(
      'Razorpay order creation failed:',
      error
    );

    res.status(500).json({
      error: 'Failed to create Razorpay order',
      details:
        error.error ||
        error.message ||
        error
    });
  }
});
router.post('/payment/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        error: 'Payment verification details are required'
      });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest('hex');

    const isValid =
      generatedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        verified: false,
        error: 'Invalid payment signature'
      });
    }

    res.status(200).json({
      verified: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error(
      'Razorpay payment verification failed:',
      error
    );

    res.status(500).json({
      verified: false,
      error: 'Payment verification failed'
    });
  }
});


// ============================================================
// PLACE MEDICINE ORDER
// ============================================================

router.post('/order', async (req, res) => {
  try {
    const {
      medicineId,
      distributor,
      retailer,
      quantity,
      orderDate
    } = req.body;

    const requestedQuantity = Number(quantity);
    const orderedBy = distributor || retailer;

    if (
      !medicineId ||
      !orderedBy ||
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return res.status(400).json({
        error:
          'Medicine, distributor/retailer, and a positive quantity are required'
      });
    }

    const setPayload = {
      orderDate: orderDate || new Date(),
      orderedQuantity: requestedQuantity,
      status: 'InTransit'
    };

    if (distributor) {
      setPayload.distributor = distributor;
    }

    if (retailer) {
      setPayload.retailer = retailer;
    }

    const medicine =
      await Medicine.findOneAndUpdate(
        {
          _id: medicineId,
          quantity: {
            $gte: requestedQuantity
          }
        },
        {
          $inc: {
            quantity: -requestedQuantity
          },
          $set: setPayload
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!medicine) {
      return res.status(404).json({
        error:
          'Medicine not found or insufficient stock'
      });
    }

    const chainResult =
      await blockchain.updateStatus(
        medicine.batchNumber,
        statusNumbers.InTransit
      );

    if (!chainResult.success) {
      logger.warn(
        'order.blockchain_status_failed',
        {
          medicineId,
          error: chainResult.error
        }
      );
    }

    logger.info('medicine.order_placed', {
      medicineId,
      orderedBy,
      quantity: requestedQuantity,
      transactionHash:
        chainResult.transactionHash
    });

    res.status(201).json({
      message: 'Order placed successfully',
      medicine
    });
  } catch (error) {
    sendError(
      res,
      error,
      'Failed to place order'
    );
  }
});


// ============================================================
// VERIFY MEDICINE AUTHENTICITY
// ============================================================

router.get(
  '/verify/:medicineId',
  async (req, res) => {
    try {
      const { medicineId } = req.params;

      // 1. Find medicine in MongoDB
      const medicine =
        await Medicine.findOne({ medicineId });

      // 2. Check medicine on blockchain
      const blockchainIdResult =
        await blockchain.getMedicineById(
          medicineId
        );

      // Medicine does not exist on blockchain
      if (
        !blockchainIdResult.success ||
        !blockchainIdResult.registered
      ) {
        await VerificationHistory.create({
          medicineId,
          medicineName:
            medicine?.name || 'Unknown medicine',
          batchNumber:
            medicine?.batchNumber || 'Unknown',
          manufacturer:
            medicine?.manufacturer || 'Unknown',
          result: 'COUNTERFEIT',
          verifiedAt: new Date()
        });

        return res.json({
          result: 'COUNTERFEIT',
          medicine: medicine || null,
          blockchain: blockchainIdResult,
          checks: {
            registered: false,
            blockchainMatch: false,
            notExpired: medicine
              ? new Date(medicine.expiryDate) >
              new Date()
              : false,
            validStatus: false,
            validOwner: false,
            duplicateScan: false
          }
        });
      }

      // 3. Get the batch linked to this Medicine ID
      const batchNumber =
        blockchainIdResult.batchNumber;

      // 4. Get complete blockchain medicine record
      const blockchainResult =
        await blockchain.getMedicine(
          batchNumber
        );

      if (!medicine) {
        await VerificationHistory.create({
          medicineId,
          medicineName: 'Unknown medicine',
          batchNumber:
            batchNumber || 'Unknown',
          manufacturer: 'Unknown',
          result: 'SUSPICIOUS',
          verifiedAt: new Date()
        });

        return res.json({
          result: 'SUSPICIOUS',
          medicine: null,
          blockchain: blockchainResult,
          checks: {
            registered: true,
            blockchainMatch: false,
            notExpired: true,
            validStatus: true,
            validOwner: Boolean(
              blockchainResult.success &&
              blockchainResult.data?.currentOwner
            ),
            duplicateScan: false
          }
        });
      }

      // 5. Compare MongoDB and blockchain batch
      const blockchainMatch =
        medicine.batchNumber === batchNumber &&
        blockchainResult.success === true;

      // 6. Check expiry
      const notExpired =
        medicine.expiryDate &&
        new Date(medicine.expiryDate) >
        new Date();

      // 7. Check medicine status
      const validStatuses = [
        'Manufactured',
        'InTransit',
        'Stored',
        'Sold'
      ];

      const validStatus =
        validStatuses.includes(
          medicine.status
        );

      // 8. Check blockchain ownership
      const currentOwner =
        blockchainResult.data?.currentOwner;

      const validOwner =
        typeof currentOwner === 'string' &&
        /^0x[a-fA-F0-9]{40}$/.test(
          currentOwner
        );

      // 9. Check whether the medicine was verified recently
      const duplicateWindow =
        new Date(
          Date.now() - 5 * 60 * 1000
        );

      const recentScan =
        await VerificationHistory.findOne({
          medicineId,
          verifiedAt: {
            $gte: duplicateWindow
          }
        });

      const duplicateScan =
        Boolean(recentScan);

      // 10. Determine final result
      let result = 'AUTHENTIC';

      if (!blockchainMatch) {
        result = 'SUSPICIOUS';
      } else if (!notExpired) {
        result = 'SUSPICIOUS';
      } else if (!validStatus) {
        result = 'SUSPICIOUS';
      } else if (!validOwner) {
        result = 'SUSPICIOUS';
      }

      // 11. Save verification history
      await VerificationHistory.create({
        medicineId: medicine.medicineId,
        medicineName: medicine.name,
        batchNumber: medicine.batchNumber,
        manufacturer: medicine.manufacturer,
        result,
        verifiedAt: new Date()
      });

      // 12. Return verification result
      return res.json({
        result,
        medicine,
        blockchain: blockchainResult,
        checks: {
          registered: true,
          blockchainMatch,
          notExpired,
          validStatus,
          validOwner,
          duplicateScan
        }
      });
    } catch (error) {
      logger.error(
        'medicine.verification_failed',
        {
          medicineId:
            req.params.medicineId,
          error: error.message
        }
      );

      res.status(500).json({
        error:
          'Medicine verification failed',
        details: error.message
      });
    }
  }
);


// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;

