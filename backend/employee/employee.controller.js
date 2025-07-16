import Employee from './employee.model.js';

export const createEmployee = async (req, res) => {
    try {
        const { employeeID } = req.body;
        if (!Number(employeeID)) {
            return res.status(400).json({
                errors: { employeeID: "Employee ID must be a number" }
            })
        }
        const employee = await Employee.create(req.body);
        return res.status(201).json(employee);
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyPattern)[0];
            return res.status(400).json({
                errors: { [duplicateField]: `${duplicateField} already exists` }
            });
        }
        if (err.name === 'ValidationError') {
            const fieldErrors = {};
            Object.values(err.errors).forEach((e) => {
                fieldErrors[e.path] = e.message;
            });
            return res.status(400).json({ errors: fieldErrors });
        }
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

export const getEmployeeDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id)
            .populate({
                path: 'allocatedSys',
                model: 'System',
                populate: {
                    path: 'parts',
                    model: 'Parts'
                }
            });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        return res.status(200).json({
            message: 'Employee fetched successfully',
            employee
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate({
            path: 'allocatedSys',
            populate: {
                path: 'parts',
                model: 'Parts'
            }
        })

        if (!employees) return res.status(404).json({ message: "No employee found" });

        return res.status(200).json({ message: 'Employees fetched successfully', employees });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) return res.status(404).json({ message: "Employee not found" });

        return res.status(200).json({ success: true, message: "Employee deleted successfully", employee });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong in deleting employee" });
    }
}

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) return res.status(404).json({ error: "Employee not found" });

        return res.status(200).json({ message: "Employee updated successfully", updatedEmployee })

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}