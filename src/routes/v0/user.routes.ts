import { Router } from 'express';

import { createUser, deleteUser, getUserById, getUsers, updateUser } from '@/controllers/users.controller'; // Import controller functions

const userRouter = Router();

// Create a new user
userRouter.post('/', createUser); // POST /users

// Get all users
userRouter.get('/', getUsers); // GET /users

// Get a user by ID
userRouter.get('/:id', getUserById); // GET /users/:id

// Update a user by ID
userRouter.put('/:id', updateUser); // PUT /users/:id

// Delete a user by ID
userRouter.delete('/:id', deleteUser); // DELETE /users/:id

export { userRouter };
