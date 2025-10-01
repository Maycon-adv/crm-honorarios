import { Router } from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes are protected by authentication
router.use(authenticate);

// GET /api/contacts - List all contacts
router.get('/', getAllContacts);

// GET /api/contacts/:id - Get single contact
router.get('/:id', getContactById);

// POST /api/contacts - Create new contact
router.post('/', createContact);

// PUT /api/contacts/:id - Update contact
router.put('/:id', updateContact);

// DELETE /api/contacts/:id - Delete contact
router.delete('/:id', deleteContact);

export default router;
