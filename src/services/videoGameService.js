import VideoGame from '../models/VideoGame.js';

export const getAllVideoGames = () => VideoGame.findAll();

export const getVideoGameById = (id) => VideoGame.findById(id);

export const createVideoGame = ({ title, genre, platform, releaseYear, rating, price }) => {
  return VideoGame.create({ title, genre, platform, releaseYear, rating, price });
};

export const updateVideoGame = (id, { title, genre, platform, releaseYear, rating, price }) => {
  const existing = VideoGame.findById(id);
  if (!existing) return null;
  return VideoGame.update(id, { title, genre, platform, releaseYear, rating, price });
};

export const deleteVideoGame = (id) => VideoGame.delete(id);
