
import { Router } from 'express';
import { getPlots, getPlotById, createPlot, updatePlot, deletePlot } from '../controllers/plotController';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getPlots);
router.get('/:id', getPlotById);
router.post('/', createPlot);
router.put('/:id', updatePlot);
router.delete('/:id', deletePlot);

export default router;
