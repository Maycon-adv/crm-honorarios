const resolveJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET deve ser configurado nas variáveis de ambiente.');
    }

    console.warn('[segurança] JWT_SECRET não definido. Usando fallback inseguro apenas para desenvolvimento/testes.');
    return 'development-insecure-jwt-secret';
  }

  return secret;
};

export const JWT_SECRET = resolveJwtSecret();
export const isProduction = process.env.NODE_ENV === 'production';