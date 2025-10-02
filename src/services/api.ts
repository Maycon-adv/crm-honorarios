// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any[];
}

// Enum Mapping (Frontend Portuguese -> Backend English)
const enumMappings = {
  agreementType: {
    'Pré-execução': 'PreExecution',
    'Pós-execução': 'PostExecution',
  },
  agreementStatus: {
    'Em Dia': 'OnTime',
    'Atrasado': 'Overdue',
    'Pago': 'Paid',
    'Cancelado': 'Cancelled',
  },
  paymentMethod: {
    'Boleto Bancário': 'Boleto',
    'Pix': 'Pix',
    'Transferência Bancária': 'Transferencia',
    'Cartão de Crédito': 'Cartao',
  },
  installmentStatus: {
    'Pendente': 'Pending',
    'Vencida': 'Overdue',
    'Paga': 'Paid',
  },
  taskStatus: {
    'Pendente': 'Pending',
    'Concluída': 'Completed',
  },
  userRole: {
    'Admin': 'Admin',
    'Dev': 'Dev',
    'Colaborador': 'Collaborator',
  },
};

// Reverse mapping (Backend English -> Frontend Portuguese)
const reverseEnumMappings = {
  agreementType: Object.fromEntries(
    Object.entries(enumMappings.agreementType).map(([k, v]) => [v, k])
  ),
  agreementStatus: Object.fromEntries(
    Object.entries(enumMappings.agreementStatus).map(([k, v]) => [v, k])
  ),
  paymentMethod: Object.fromEntries(
    Object.entries(enumMappings.paymentMethod).map(([k, v]) => [v, k])
  ),
  installmentStatus: Object.fromEntries(
    Object.entries(enumMappings.installmentStatus).map(([k, v]) => [v, k])
  ),
  taskStatus: Object.fromEntries(
    Object.entries(enumMappings.taskStatus).map(([k, v]) => [v, k])
  ),
  userRole: Object.fromEntries(
    Object.entries(enumMappings.userRole).map(([k, v]) => [v, k])
  ),
};

// Helper functions to convert enums
const toBackendEnum = (value: string, type: keyof typeof enumMappings): string => {
  return (enumMappings[type] as any)[value] || value;
};

const toFrontendEnum = (value: string, type: keyof typeof reverseEnumMappings): string => {
  return (reverseEnumMappings[type] as any)[value] || value;
};

// Token Management
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// API Helper Functions
const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    // Log detailed error for debugging
    if (data.details) {
      console.error('Validation errors:', data.details);
    }
    throw new Error(data.error || 'Erro na requisição');
  }

  return data.data as T;
};

// Authentication API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const payload = {
      ...userData,
      role: userData.role ? toBackendEnum(userData.role, 'userRole') : undefined,
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(payload),
    });

    const result = await handleResponse<{ user: any; token: string }>(response);

    return {
      ...result,
      user: {
        ...result.user,
        role: toFrontendEnum(result.user.role, 'userRole'),
      },
    };
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
    });

    const result = await handleResponse<{ user: any; token: string }>(response);

    return {
      ...result,
      user: {
        ...result.user,
        role: toFrontendEnum(result.user.role, 'userRole'),
      },
    };
  },
};

// Contacts API
export const contactsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<any[]>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<any>(response);
  },

  create: async (contactData: {
    name: string;
    email?: string;
    phone?: string;
    document?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(contactData),
    });
    return handleResponse<any>(response);
  },

  update: async (id: string, contactData: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(contactData),
    });
    return handleResponse<any>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<any>(response);
  },
};

// Agreements API
export const agreementsAPI = {
  getAll: async (filters?: { status?: string; contactId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append('status', toBackendEnum(filters.status, 'agreementStatus'));
    }
    if (filters?.contactId) params.append('contactId', filters.contactId);

    const url = `${API_BASE_URL}/agreements${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    const agreements = await handleResponse<any[]>(response);

    // Convert enums back to Portuguese
    return agreements.map(agreement => ({
      ...agreement,
      agreementType: toFrontendEnum(agreement.agreementType, 'agreementType'),
      paymentMethod: toFrontendEnum(agreement.paymentMethod, 'paymentMethod'),
      status: toFrontendEnum(agreement.status, 'agreementStatus'),
      installments: agreement.installments?.map((inst: any) => ({
        ...inst,
        status: toFrontendEnum(inst.status, 'installmentStatus'),
      })) || [],
    }));
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/agreements/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const agreement = await handleResponse<any>(response);

    // Convert enums back to Portuguese
    return {
      ...agreement,
      agreementType: toFrontendEnum(agreement.agreementType, 'agreementType'),
      paymentMethod: toFrontendEnum(agreement.paymentMethod, 'paymentMethod'),
      status: toFrontendEnum(agreement.status, 'agreementStatus'),
      installments: agreement.installments?.map((inst: any) => ({
        ...inst,
        status: toFrontendEnum(inst.status, 'installmentStatus'),
      })) || [],
    };
  },

  create: async (agreementData: {
    recordNumber: string;
    processNumber: string;
    contactId: string;
    responsibleCollaborator: string;
    agreementType: string;
    paymentMethod: string;
    agreedValue: number;
    agreementDate: string;
    status?: string;
    observations?: string;
    installments: Array<{
      installmentNumber: number;
      value: number;
      dueDate: string;
      status?: string;
      paymentDate?: string;
    }>;
  }) => {
    // Convert enums to English before sending
    const backendData = {
      ...agreementData,
      agreementType: toBackendEnum(agreementData.agreementType, 'agreementType'),
      paymentMethod: toBackendEnum(agreementData.paymentMethod, 'paymentMethod'),
      status: agreementData.status ? toBackendEnum(agreementData.status, 'agreementStatus') : undefined,
      installments: agreementData.installments.map(inst => ({
        ...inst,
        status: inst.status ? toBackendEnum(inst.status, 'installmentStatus') : undefined,
      })),
    };

    const response = await fetch(`${API_BASE_URL}/agreements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(backendData),
    });
    const agreement = await handleResponse<any>(response);

    // Convert enums back to Portuguese
    return {
      ...agreement,
      agreementType: toFrontendEnum(agreement.agreementType, 'agreementType'),
      paymentMethod: toFrontendEnum(agreement.paymentMethod, 'paymentMethod'),
      status: toFrontendEnum(agreement.status, 'agreementStatus'),
      installments: agreement.installments?.map((inst: any) => ({
        ...inst,
        status: toFrontendEnum(inst.status, 'installmentStatus'),
      })) || [],
    };
  },

  update: async (id: string, agreementData: {
    recordNumber?: string;
    processNumber?: string;
    contactId?: string;
    responsibleCollaborator?: string;
    agreementType?: string;
    paymentMethod?: string;
    agreedValue?: number;
    agreementDate?: string;
    status?: string;
    observations?: string;
  }) => {
    // Convert enums to English before sending
    const backendData = {
      ...agreementData,
      agreementType: agreementData.agreementType ? toBackendEnum(agreementData.agreementType, 'agreementType') : undefined,
      paymentMethod: agreementData.paymentMethod ? toBackendEnum(agreementData.paymentMethod, 'paymentMethod') : undefined,
      status: agreementData.status ? toBackendEnum(agreementData.status, 'agreementStatus') : undefined,
    };

    const response = await fetch(`${API_BASE_URL}/agreements/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(backendData),
    });
    const agreement = await handleResponse<any>(response);

    // Convert enums back to Portuguese
    return {
      ...agreement,
      agreementType: toFrontendEnum(agreement.agreementType, 'agreementType'),
      paymentMethod: toFrontendEnum(agreement.paymentMethod, 'paymentMethod'),
      status: toFrontendEnum(agreement.status, 'agreementStatus'),
      installments: agreement.installments?.map((inst: any) => ({
        ...inst,
        status: toFrontendEnum(inst.status, 'installmentStatus'),
      })) || [],
    };
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/agreements/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<any>(response);
  },

  updateInstallment: async (
    agreementId: string,
    installmentId: string,
    installmentData: {
      status: string;
      paymentDate?: string;
    }
  ) => {
    // Convert enum to English before sending
    const backendData = {
      status: toBackendEnum(installmentData.status, 'installmentStatus'),
      paymentDate: installmentData.paymentDate,
    };

    const response = await fetch(
      `${API_BASE_URL}/agreements/${agreementId}/installments/${installmentId}`,
      {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(backendData),
      }
    );
    const installment = await handleResponse<any>(response);

    // Convert enum back to Portuguese
    return {
      ...installment,
      status: toFrontendEnum(installment.status, 'installmentStatus'),
    };
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (filters?: { status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append('status', toBackendEnum(filters.status, 'taskStatus'));
    }

    const url = `${API_BASE_URL}/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    const tasks = await handleResponse<any[]>(response);

    // Convert enums back to Portuguese
    return tasks.map(task => ({
      ...task,
      status: toFrontendEnum(task.status, 'taskStatus'),
    }));
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const task = await handleResponse<any>(response);

    // Convert enum back to Portuguese
    return {
      ...task,
      status: toFrontendEnum(task.status, 'taskStatus'),
    };
  },

  create: async (taskData: {
    title: string;
    dueDate: string;
    status?: string;
  }) => {
    // Convert enum to English before sending
    const backendData = {
      ...taskData,
      status: taskData.status ? toBackendEnum(taskData.status, 'taskStatus') : undefined,
    };

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(backendData),
    });
    const task = await handleResponse<any>(response);

    // Convert enum back to Portuguese
    return {
      ...task,
      status: toFrontendEnum(task.status, 'taskStatus'),
    };
  },

  update: async (id: string, taskData: {
    title?: string;
    dueDate?: string;
    status?: string;
  }) => {
    // Convert enum to English before sending
    const backendData = {
      ...taskData,
      status: taskData.status ? toBackendEnum(taskData.status, 'taskStatus') : undefined,
    };

    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(backendData),
    });
    const task = await handleResponse<any>(response);

    // Convert enum back to Portuguese
    return {
      ...task,
      status: toFrontendEnum(task.status, 'taskStatus'),
    };
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<any>(response);
  },
};

// Health Check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
  return handleResponse<{ status: string; message: string }>(response);
};
