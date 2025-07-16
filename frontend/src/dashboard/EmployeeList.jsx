import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from "axios";
import { toast } from "react-toastify";
import { useEmployees } from '../context/EmployeeContext';
import CreateEmployee from './CreateEmployee';

const EmployeeList = () => {
    const { employees, setEmployees } = useEmployees();
    const navigate = useNavigate();
    const [openMenuId, setOpenMenuId] = useState(null);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/employee/${id}`);
            setEmployees((prev) => prev.filter(emp => emp._id !== id));
            toast.success("Employee deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete employee");
        }
    };

    const handleView = (id) => {
        navigate(`/employee/view/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/employee/edit/${id}`);
    };

    const toggleMenu = (id) => {
        setOpenMenuId(prev => prev === id ? null : id);
    };

    return (
        <div className="w-full px-6 py-4 relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Total Employees ({employees.length})</h2>
                <div className="flex gap-4">
                    <CreateEmployee />
                    <button
                        onClick={() => navigate('/superadmin')}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg w-full">
                <div className="grid grid-cols-4 font-semibold px-4 py-3 border-b bg-gray-100 text-gray-700">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Phone</div>
                    <div>Actions</div>
                </div>

                {employees.map(emp => (
                    <div
                        key={emp._id}
                        className="grid grid-cols-4 items-center px-4 py-3 border-b hover:bg-gray-50 transition"
                    >
                        <span className="text-gray-800">{emp.name}</span>
                        <span className="text-gray-600">{emp.email}</span>
                        <span className="text-gray-600">{emp.phone}</span>

                        {/* Action Menu */}
                        <div className="relative flex justify-between z-50">
                            <button
                                className="text-gray-600 hover:text-gray-800 text-xl"
                                onClick={() => toggleMenu(emp._id)}
                            >
                                ⋮
                            </button>

                            {openMenuId === emp._id && (
                                <div className="absolute right-10 ml-2 bottom-full mb-2 bg-white border rounded shadow-xl z-[9999] min-w-[140px]">
                                    <button
                                        onClick={() => handleView(emp._id)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(emp._id)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(emp._id)}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeList;
