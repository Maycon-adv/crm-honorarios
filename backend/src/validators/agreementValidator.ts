import { z } from 'zod';

// Enum validators
const agreementTypeEnum = z.enum(['PreExecution', 'PostExecution']);
const agreementStatusEnum = z.enum(['OnTime', 'Overdue', 'Paid', 'Cancelled']);
const paymentMethodEnum = z.enum(['Boleto', 'Pix', 'Transferencia', 'Cartao']);
const installmentStatusEnum = z.enum(['Pending', 'Overdue', 'Paid']);

// Installment schema
const installmentSchema = z.object({
  installmentNumber: z.number().int().positive(),
  value: z.number().positive('Valor deve ser maior que zero'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  status: installmentStatusEnum.optional(),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional(),
});

export const createAgreementSchema = z.object({
  recordNumber: z.string().min(1, 'Número de registro é obrigatório'),
  processNumber: z.string().min(1, 'Número do processo é obrigatório'),
  contactId: z.string().uuid('ID do contato inválido'),
  responsibleCollaborator: z.string().min(1, 'Colaborador responsável é obrigatório'),
  agreementType: agreementTypeEnum,
  paymentMethod: paymentMethodEnum,
  agreedValue: z.number().positive('Valor deve ser maior que zero'),
  agreementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  status: agreementStatusEnum.optional(),
  observations: z.string().optional(),
  installments: z.array(installmentSchema).min(1, 'Deve haver pelo menos uma parcela'),
});

export const updateAgreementSchema = z.object({
  recordNumber: z.string().min(1).optional(),
  processNumber: z.string().min(1).optional(),
  contactId: z.string().uuid().optional(),
  responsibleCollaborator: z.string().min(1).optional(),
  agreementType: agreementTypeEnum.optional(),
  paymentMethod: paymentMethodEnum.optional(),
  agreedValue: z.number().positive().optional(),
  agreementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: agreementStatusEnum.optional(),
  observations: z.string().optional(),
});

export const updateInstallmentSchema = z.object({
  status: installmentStatusEnum,
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional(),
});

export type CreateAgreementInput = z.infer<typeof createAgreementSchema>;
export type UpdateAgreementInput = z.infer<typeof updateAgreementSchema>;
export type UpdateInstallmentInput = z.infer<typeof updateInstallmentSchema>;
