import express from "express";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeDetails, updateEmployee } from "./employee.controller.js";

const router = express.Router();

router.get('/allemployee', getAllEmployees);
router.post('/', createEmployee);
router.delete('/:id', deleteEmployee);
router.get('/:id', getEmployeeDetails);
router.put('/:id', updateEmployee);

export default router;