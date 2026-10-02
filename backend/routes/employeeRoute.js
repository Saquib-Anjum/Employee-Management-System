import express from 'express';
const employeeRouter = express.Router();
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../controllers/employeeController.js';
import { protect, protectAdmin } from '../middlewares/auth.js';


//get employees
employeeRouter.get('/',protect,protectAdmin,getEmployees);
//create employee
employeeRouter.post('/',protect,protectAdmin,createEmployee);
//update employee
employeeRouter.put('/',protect,protectAdmin,updateEmployee);
//delete employee
employeeRouter.delete('/',protect,protectAdmin,deleteEmployee);

export default employeeRouter;