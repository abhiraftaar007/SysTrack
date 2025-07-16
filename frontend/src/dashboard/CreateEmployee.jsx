import React, { useState } from 'react'
import { useEmployees } from '../context/EmployeeContext';
import axios from "axios";
import { toast } from 'react-toastify';

const CreateEmployee = () => {

    const { setEmployees } = useEmployees();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        employeeID: '',
        department: '',
        designation: '',
        email: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            if (!/^\d*$/.test(value)) return;
            if (value.length > 10) return;
        }

        setNewEmployee((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ''
        }));
    };


    const handleCreateEmployee = async () => {
        const fieldErrors = {};

        // Frontend phone validation
        if (newEmployee.phone.length !== 10) {
            fieldErrors.phone = "Phone number must be exactly 10 digits.";
            setErrors(fieldErrors);
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/employee', newEmployee);
            if (res.status === 201) {
                setEmployees((prev) => [...prev, res.data]);
                toast.success(res.data.message || "Employee created successfully");
                setIsModalOpen(false);
                setNewEmployee({
                    name: '',
                    employeeID: '',
                    department: '',
                    designation: '',
                    email: '',
                    phone: ''
                });
                setErrors({});
            }
        } catch (err) {
            console.error('Failed to create employee:', err);

            if (err.response?.data?.message) {
                const message = err.response.data.message;
                const field = message.split(' ')[0];
                setErrors({ [field]: message });
                toast.error(message);
            }

            if (err.response?.data?.errors) {
                const fieldErrors = err.response.data.errors;
                setErrors(fieldErrors);

                const firstError = Object.values(fieldErrors)[0];
            }
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                + Create Employee
            </button>

            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                        <div
                            className='bg-white w-full max-w-lg p-6 rounded-lg shadow-lg'
                        >
                            <h2 className='text-xl font-semibold mb-4'>Create New Employee</h2>
                            <div className='grid grid-cols-1 gap-4'>
                                {['name', 'employeeID', 'department', 'designation', 'email', 'phone'].map((field) => (
                                    <div key={field} className='flex flex-col'>
                                        <input
                                            name={field}
                                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                            value={newEmployee[field]}
                                            onChange={handleInputChange}
                                            className={`border p-2 rounded w-full ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors[field] && (
                                            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className='flex justify-end gap-4 mt-6'>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setErrors({});
                                        setNewEmployee({
                                            name: '',
                                            employeeID: '',
                                            department: '',
                                            designation: '',
                                            email: '',
                                            phone: ''
                                        });
                                    }}
                                    className='px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateEmployee}
                                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default CreateEmployee