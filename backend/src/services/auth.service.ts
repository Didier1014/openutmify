import { prisma } from '../utils/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';

export const registerUser = async (email: string, password: string, name: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('E-mail já cadastrado');

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash, name },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Credenciais inválidas');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error('Credenciais inválidas');

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  };
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, twoFactorEnabled: true, createdAt: true },
  });
};
