import * as videoGameService from '../services/videoGameService.js';

export const getAllVideoGames = (req, res) => {
  try {
    const videoGames = videoGameService.getAllVideoGames();
    res.status(200).json(videoGames);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getVideoGameById = (req, res) => {
  try {
    const videoGame = videoGameService.getVideoGameById(req.params.id);
    if (!videoGame) return res.status(404).json({ message: 'Video game not found' });
    res.status(200).json(videoGame);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createVideoGame = (req, res) => {
  try {
    const { title, genre, platform, releaseYear, rating, price } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const created = videoGameService.createVideoGame({ title, genre, platform, releaseYear, rating, price });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateVideoGame = (req, res) => {
  try {
    const { title, genre, platform, releaseYear, rating, price } = req.body;
    const updated = videoGameService.updateVideoGame(req.params.id, { title, genre, platform, releaseYear, rating, price });
    if (!updated) return res.status(404).json({ message: 'Video game not found' });
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteVideoGame = (req, res) => {
  try {
    const ok = videoGameService.deleteVideoGame(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Video game not found' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
