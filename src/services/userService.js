import User from '../models/User.js';

export const getAllUsers = () => User.findAll();

export const getUserById = (id) => User.findById(id);

export const createUser = ({ name, email }) => {
  if (email && User.emailExists(email)) {
    throw new Error('Email already exists');
  }
  return User.create({ name, email });
};

export const updateUser = (id, { name, email }) => {
  const existing = User.findById(id);
  if (!existing) return null;
  if (email && email !== existing.email && User.emailExists(email, id)) {
    throw new Error('Email already exists');
  }
  return User.update(id, { name, email });
};

export const deleteUser = (id) => User.delete(id);
