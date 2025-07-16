import System from "./system.model.js";
import Employee from "../employee/employee.model.js";
import Part from '../parts/parts.model.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalSystems = await System.countDocuments();
        const totalParts = await Part.countDocuments();
        const totalEmployees = await Employee.countDocuments();

        return res.status(200).json({
            message: "All stats fetched",
            totalSystems,
            totalParts,
            totalEmployees,
        })
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch dashboard stats." });
    }
}

export const createSystem = async (req, res) => {
    try {
        const { parts, assignedTo, status } = req.body;
        const errors = {};

        if (!Array.isArray(parts) || parts.length === 0) {
            errors.parts = "At least one part must be selected.";
        } else {
            const existingParts = await Part.find({ _id: { $in: parts } });
            if (existingParts.length !== parts.length) {
                errors.parts = "One or more parts do not exist.";
            }
            const assignedParts = existingParts.filter(part => part.assignedSystem);
            if (assignedParts.length > 0) {
                errors.parts = `Some parts are already assigned to another system: ${assignedParts.map(p => p.barcode).join(', ')}`;
            }
        }

        if (assignedTo) {
            const existingEmployee = await Employee.findById(assignedTo);
            if (!existingEmployee) {
                errors.assignedTo = "Employee does not exist.";
            }
            const employeeAlreadyHasSystem = await System.findOne({ assignedTo });
            if (employeeAlreadyHasSystem) {
                errors.assignedTo = "Employee already has a system assigned.";
            }
            if (status !== 'assigned') {
                errors.status = "Status must be 'assigned' if assigning to an employee.";
            }
        }
        if (!assignedTo && status === 'assigned') {
            errors.status = "Cannot mark as 'assigned' without assigning to an employee.";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        const system = await System.create({ parts, assignedTo, status });

        await Part.updateMany(
            { _id: { $in: parts } },
            { $set: { assignedSystem: system._id } }
        );

        return res.status(201).json({
            message: "System created successfully",
            system
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

export const getSystemById = async (req, res) => {
    try {
        const { id } = req.params;
        const system = await System.findById(id).populate('parts');

        if (!system) return res.status(404).json({ error: "System not found" });

        return res.status(200).json({ message: "System fetched successfully", system })
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

export const getAllSystems = async (req, res) => {
    try {
        const systems = await System.find().populate({
            path: 'parts',
            model: 'Parts'
        })

        if (!systems) return res.status(404).json({ message: "No employee found" });

        return res.status(200).json({ message: 'Systems fetched successfully', systems });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const assignSystem = async (req, res) => {
    const { systemId, employeeId } = req.body;

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        const system = await System.findById(systemId);
        if (!system) return res.status(404).json({ message: "System not found" });

        system.assignedTo = employeeId;
        system.status = "assigned";
        await system.save();

        employee.allocatedSys = systemId;
        await employee.save();

        const updatedEmployee = await Employee.findById(employeeId)
            .populate({
                path: "allocatedSys",
                populate: {
                    path: "parts"
                }
            })

        return res.status(200).json({ message: "System assigned", updatedEmployee });
    } catch (error) {
        return res.status(500).json({ message: "Assignment failed", error: err });
    }
}

export const unassignSystem = async (req, res) => {
    const { systemId } = req.params;

    try {
        const system = await System.findById(systemId).populate('assignedTo').populate('parts');
        if (!system) {
            return res.status(404).json({ message: 'System not found' });
        }

        if (system.assignedTo) {
            await Employee.findByIdAndUpdate(system.assignedTo._id, {
                allocatedSys: null,
            });
        }

        await Employee.updateMany(
            { allocatedSys: system._id },
            { $set: { allocatedSys: null } }
        );

        await Promise.all(
            system.parts.map(part =>
                Part.findByIdAndUpdate(part._id, { allocatedTo: null })
            )
        );

        const updatedSystem = await System.findByIdAndUpdate(
            systemId,
            {
                assignedTo: null,
                status: 'unassigned',
            },
            { new: true }
        ).populate('parts');

        return res.status(200).json({
            message: 'System fully unassigned from employee and parts',
            system: updatedSystem,
        });
    } catch (error) {
        console.error("Unassignment failed:", error);
        return res.status(500).json({ message: 'Unassignment failed', error });
    }
};

export const deallocateSystem = async (req, res) => {
    const { systemId } = req.params;

    try {
        const system = await System.findByIdAndUpdate(
            systemId,
            {
                assignedTo: null,
                status: "deallocated"
            },
            { new: true }
        ).populate("parts");

        if (!system) return res.status(404).json({ message: "System not found" });

        return res.status(200).json({ message: "System deallocated", system });

    } catch (error) {
        return res.status(500).json({ message: "Deallocation failed", error: error });
    }
}