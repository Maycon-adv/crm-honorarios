import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import {
  createAgreementSchema,
  updateAgreementSchema,
  updateInstallmentSchema
} from '../validators/agreementValidator';

const prisma = new PrismaClient();

// GET /api/agreements - List all agreements
export const getAllAgreements = async (req: AuthRequest, res: Response) => {
  try {
    const { status, contactId } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (contactId) {
      where.contactId = contactId;
    }

    const agreements = await prisma.agreement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: true,
        installments: {
          orderBy: { installmentNumber: 'asc' },
        },
        _count: {
          select: {
            installments: true,
            activityLogs: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: agreements,
    });
  } catch (error) {
    console.error('Get all agreements error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar acordos',
    });
  }
};

// GET /api/agreements/:id - Get single agreement
export const getAgreementById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const agreement = await prisma.agreement.findUnique({
      where: { id },
      include: {
        contact: true,
        installments: {
          orderBy: { installmentNumber: 'asc' },
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        error: 'Acordo não encontrado',
      });
    }

    res.json({
      success: true,
      data: agreement,
    });
  } catch (error) {
    console.error('Get agreement error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar acordo',
    });
  }
};

// POST /api/agreements - Create new agreement
export const createAgreement = async (req: AuthRequest, res: Response) => {
  try {
    const validationResult = createAgreementSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: validationResult.error.issues,
      });
    }

    const data = validationResult.data;

    // Check if recordNumber already exists
    const existingAgreement = await prisma.agreement.findUnique({
      where: { recordNumber: data.recordNumber },
    });

    if (existingAgreement) {
      return res.status(400).json({
        success: false,
        error: 'Já existe um acordo com este número de registro',
      });
    }

    // Check if contact exists
    const contact = await prisma.contact.findUnique({
      where: { id: data.contactId },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contato não encontrado',
      });
    }

    // Create agreement with installments
    const agreement = await prisma.agreement.create({
      data: {
        recordNumber: data.recordNumber,
        processNumber: data.processNumber,
        contactId: data.contactId,
        responsibleCollaborator: data.responsibleCollaborator,
        agreementType: data.agreementType,
        paymentMethod: data.paymentMethod,
        agreedValue: data.agreedValue,
        agreementDate: data.agreementDate,
        status: data.status || 'OnTime',
        observations: data.observations,
        installments: {
          create: data.installments.map(inst => ({
            installmentNumber: inst.installmentNumber,
            value: inst.value,
            dueDate: inst.dueDate,
            status: inst.status || 'Pending',
            paymentDate: inst.paymentDate,
          })),
        },
      },
      include: {
        contact: true,
        installments: {
          orderBy: { installmentNumber: 'asc' },
        },
      },
    });

    // Create activity log
    if (req.user) {
      await prisma.activityLog.create({
        data: {
          userId: req.user.userId,
          userName: req.user.email,
          action: `Criou o acordo ${data.recordNumber}`,
          agreementId: agreement.id,
          agreementRecordNumber: data.recordNumber,
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.status(201).json({
      success: true,
      data: agreement,
      message: 'Acordo criado com sucesso',
    });
  } catch (error) {
    console.error('Create agreement error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar acordo',
    });
  }
};

// PUT /api/agreements/:id - Update agreement
export const updateAgreement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const validationResult = updateAgreementSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: validationResult.error.issues,
      });
    }

    // Check if agreement exists
    const existingAgreement = await prisma.agreement.findUnique({
      where: { id },
    });

    if (!existingAgreement) {
      return res.status(404).json({
        success: false,
        error: 'Acordo não encontrado',
      });
    }

    const data = validationResult.data;

    // Check if recordNumber is being changed and already exists
    if (data.recordNumber && data.recordNumber !== existingAgreement.recordNumber) {
      const duplicateAgreement = await prisma.agreement.findUnique({
        where: { recordNumber: data.recordNumber },
      });

      if (duplicateAgreement) {
        return res.status(400).json({
          success: false,
          error: 'Já existe um acordo com este número de registro',
        });
      }
    }

    // Check if contact exists (if being changed)
    if (data.contactId) {
      const contact = await prisma.contact.findUnique({
        where: { id: data.contactId },
      });

      if (!contact) {
        return res.status(404).json({
          success: false,
          error: 'Contato não encontrado',
        });
      }
    }

    const agreement = await prisma.agreement.update({
      where: { id },
      data,
      include: {
        contact: true,
        installments: {
          orderBy: { installmentNumber: 'asc' },
        },
      },
    });

    // Create activity log
    if (req.user) {
      await prisma.activityLog.create({
        data: {
          userId: req.user.userId,
          userName: req.user.email,
          action: `Atualizou o acordo ${agreement.recordNumber}`,
          agreementId: agreement.id,
          agreementRecordNumber: agreement.recordNumber,
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.json({
      success: true,
      data: agreement,
      message: 'Acordo atualizado com sucesso',
    });
  } catch (error) {
    console.error('Update agreement error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar acordo',
    });
  }
};

// DELETE /api/agreements/:id - Delete agreement
export const deleteAgreement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if agreement exists
    const agreement = await prisma.agreement.findUnique({
      where: { id },
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        error: 'Acordo não encontrado',
      });
    }

    // Delete agreement (will cascade delete installments, notifications, and activity logs)
    await prisma.agreement.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Acordo excluído com sucesso',
    });
  } catch (error) {
    console.error('Delete agreement error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir acordo',
    });
  }
};

// PUT /api/agreements/:agreementId/installments/:installmentId - Update installment
export const updateInstallment = async (req: AuthRequest, res: Response) => {
  try {
    const { agreementId, installmentId } = req.params;

    const validationResult = updateInstallmentSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: validationResult.error.issues,
      });
    }

    // Check if installment exists and belongs to agreement
    const installment = await prisma.installment.findFirst({
      where: {
        id: installmentId,
        agreementId,
      },
      include: {
        agreement: true,
      },
    });

    if (!installment) {
      return res.status(404).json({
        success: false,
        error: 'Parcela não encontrada',
      });
    }

    const data = validationResult.data;

    const updatedInstallment = await prisma.installment.update({
      where: { id: installmentId },
      data: {
        status: data.status,
        paymentDate: data.paymentDate,
      },
    });

    // Create activity log
    if (req.user) {
      await prisma.activityLog.create({
        data: {
          userId: req.user.userId,
          userName: req.user.email,
          action: `Atualizou parcela ${installment.installmentNumber} do acordo ${installment.agreement.recordNumber}`,
          agreementId: agreementId,
          agreementRecordNumber: installment.agreement.recordNumber,
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.json({
      success: true,
      data: updatedInstallment,
      message: 'Parcela atualizada com sucesso',
    });
  } catch (error) {
    console.error('Update installment error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar parcela',
    });
  }
};
