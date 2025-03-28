import type { Request, Response } from 'express';

import { asyncCatch } from '@/error/async.catch';
import { CustomError } from '@/error/custom.api.error';

import { sendHttpResponse } from '@/utils/send.http.response';

import prisma from '@/database/prisma-client';

// Create a new user
export const createUser = asyncCatch(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!email || !password) throw new CustomError(400, 'ERR-001', 'Email and password are required');

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  sendHttpResponse(res, 201, 'User created successfully', newUser);
});

// Get all users
export const getUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  sendHttpResponse(res, 200, 'Users fetched successfully', users);
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) throw new CustomError(404, 'ERR-002', 'User not found');

  sendHttpResponse(res, 200, 'User fetched successfully', user);
};

// Update a user by ID
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, email, password },
  });

  sendHttpResponse(res, 200, 'User updated successfully', updatedUser);
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Delete the user
  const deletedUser = await prisma.user.delete({
    where: { id: Number(id) },
  });

  sendHttpResponse(res, 200, 'User deleted successfully', deletedUser);
};
