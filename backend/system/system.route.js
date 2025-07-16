import express from 'express';
import { assignSystem, createSystem, deallocateSystem, getAllSystems, getDashboardStats, getSystemById, unassignSystem } from './system.controller.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.post('/', createSystem);
router.get('/allsys', getAllSystems);
router.post("/assign", assignSystem);
router.patch("/unassign/:systemId", unassignSystem);
router.patch("/deallocate/:systemId", deallocateSystem);
router.get('/:id', getSystemById);


export default router;
