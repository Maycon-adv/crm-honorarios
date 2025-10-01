import { Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { AuthRequest } from '../middleware/auth';
import { createContactSchema, updateContactSchema } from '../validators/contactValidator';

const prisma = new PrismaClient();

// GET /api/contacts - List all contacts
export const getAllContacts = async (req: AuthRequest, res: Response) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { agreements: true },
        },
      },
    });

    res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error('Get all contacts error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar contatos',
    });
  }
};

// GET /api/contacts/:id - Get single contact
export const getContactById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        agreements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contato não encontrado',
      });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar contato',
    });
  }
};

// POST /api/contacts - Create new contact
export const createContact = async (req: AuthRequest, res: Response) => {
  try {
    const validationResult = createContactSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: validationResult.error.issues,
      });
    }

    const data = validationResult.data;

    // Check if document already exists (if provided)
    if (data.document) {
      const existingContact = await prisma.contact.findFirst({
        where: { document: data.document },
      });

      if (existingContact) {
        return res.status(400).json({
          success: false,
          error: 'Já existe um contato com este documento',
        });
      }
    }

    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        document: data.document || null,
      },
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Contato criado com sucesso',
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar contato',
    });
  }
};

// PUT /api/contacts/:id - Update contact
export const updateContact = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const validationResult = updateContactSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: validationResult.error.issues,
      });
    }

    // Check if contact exists
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return res.status(404).json({
        success: false,
        error: 'Contato não encontrado',
      });
    }

    const data = validationResult.data;

    // Check if document is being changed and already exists
    if (data.document && data.document !== existingContact.document) {
      const duplicateContact = await prisma.contact.findFirst({
        where: {
          document: data.document,
          id: { not: id },
        },
      });

      if (duplicateContact) {
        return res.status(400).json({
          success: false,
          error: 'Já existe um contato com este documento',
        });
      }
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email === '' ? null : data.email,
        phone: data.phone,
        document: data.document,
      },
    });

    res.json({
      success: true,
      data: contact,
      message: 'Contato atualizado com sucesso',
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar contato',
    });
  }
};

// DELETE /api/contacts/:id - Delete contact
export const deleteContact = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if contact exists
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        _count: {
          select: { agreements: true },
        },
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contato não encontrado',
      });
    }

    // Check if contact has agreements
    if (contact._count.agreements > 0) {
      return res.status(400).json({
        success: false,
        error: 'Não é possível excluir contato com acordos associados',
      });
    }

    await prisma.contact.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Contato excluído com sucesso',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir contato',
    });
  }
};
