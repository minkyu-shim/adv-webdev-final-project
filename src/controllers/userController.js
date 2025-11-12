import * as userService from '../services/userService.js';

export const getAllUsers = (req, res) => {
  try {
    const users = userService.getAllUsers();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getUserById = (req, res) => {
  try {
    const user = userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createUser = (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const created = userService.createUser({ name, email });
    res.status(201).json(created);
  } catch (e) {
    if (e.message === 'Email already exists') {
      return res.status(409).json({ message: e.message });
    }
    res.status(500).json({ message: e.message });
  }
};

export const updateUser = (req, res) => {
  try {
    const { name, email } = req.body;
    const updated = userService.updateUser(req.params.id, { name, email });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updated);
  } catch (e) {
    if (e.message === 'Email already exists') {
      return res.status(409).json({ message: e.message });
    }
    res.status(500).json({ message: e.message });
  }
};

export const deleteUser = (req, res) => {
  try {
    const ok = userService.deleteUser(req.params.id);
    if (!ok) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
