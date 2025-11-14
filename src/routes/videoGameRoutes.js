import express from 'express';
import * as videoGameController from '../controllers/videoGameController.js';

const router = express.Router();

router.get('/', videoGameController.getAllVideoGames);
router.get('/:id', videoGameController.getVideoGameById);
router.post('/', videoGameController.createVideoGame);
router.put('/:id', videoGameController.updateVideoGame);
router.delete('/:id', videoGameController.deleteVideoGame);

export default router;
