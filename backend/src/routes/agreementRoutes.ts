import { Router } from 'express';
import {
  getAllAgreements,
  getAgreementById,
  createAgreement,
  updateAgreement,
  deleteAgreement,
  updateInstallment,
} from '../controllers/agreementController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes are protected by authentication
router.use(authenticate);

// GET /api/agreements - List all agreements (with optional filters)
router.get('/', getAllAgreements);

// GET /api/agreements/:id - Get single agreement
router.get('/:id', getAgreementById);

// POST /api/agreements - Create new agreement
router.post('/', createAgreement);

// PUT /api/agreements/:id - Update agreement
router.put('/:id', updateAgreement);

// DELETE /api/agreements/:id - Delete agreement
router.delete('/:id', deleteAgreement);

// PUT /api/agreements/:agreementId/installments/:installmentId - Update installment
router.put('/:agreementId/installments/:installmentId', updateInstallment);

export default router;
