import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSystems } from '../context/SystemContext';
import axios from 'axios';
import {
    UilEye,
    UilEdit,
    UilTrashAlt,
} from "@iconscout/react-unicons";
import CreateSystem from './CreateSystem';

const SystemListPage = () => {
    const { systems, setSystems } = useSystems();
    const [selectedSystem, setSelectedSystem] = useState(null);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(null);
    const [errors, setErrors] = useState({});

    const handleOpen = (type, system) => {
        setSelectedSystem(system);
        setOpenModal(type);
    };
    const handleClose = () => {
        setSelectedSystem(null);
        setOpenModal(null);
    };

    const fetchSystems = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/system/allsys');
            setSystems(res.data.systems);
        } catch (err) {
            console.log(err);
            setError('Failed to fetch parts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(systems)
        fetchSystems();
    }, []);

    if (loading) return <p className="text-gray-500">Loading parts...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="w-full px-4 py-4">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Total Systems ({systems.length > 0 ? systems.length : '0'})
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded shadow hover:from-blue-600 hover:to-indigo-700"
                    >
                        + Add New System
                    </button>
                    <button
                        onClick={() => navigate('/superadmin')}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            {showModal && <CreateSystem onClose={() => setShowModal(false)} />}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-lg shadow text-sm">
                    <thead className="bg-gray-100 text-gray-600 text-left">
                        <tr>
                            <th className="py-2 px-4">System Name</th>
                            <th className="py-2 px-4">Total Parts</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {systems.map((system) => (
                            <tr key={system._id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">{system.name}</td>
                                <td className="py-2 px-4">{system.parts?.length ?? 0}</td>
                                <td className="py-2 px-4 capitalize">{system.status}</td>
                                <td className="py-2 px-4 text-center space-x-2">
                                    <button onClick={() => handleOpen("view", system)}>
                                        <UilEye className="text-blue-600 hover:text-blue-800" />
                                    </button>
                                    <button onClick={() => handleOpen("edit", system)}>
                                        <UilEdit className="text-green-600 hover:text-green-800" />
                                    </button>
                                    <button onClick={() => handleOpen("delete", system)}>
                                        <UilTrashAlt className="text-red-600 hover:text-red-800" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {openModal === "view" && selectedSystem && (
                <Modal title={`View System`} onClose={handleClose}>
                    <div className="max-h-[70vh] overflow-y-auto space-y-4 text-gray-700 pr-2">
                        <p><strong>System Name:</strong> {selectedSystem.name}</p>
                        <p><strong>Status:</strong> <span className={selectedSystem.status === "assigned" ? "text-green-600" : "text-yellow-600"}>{selectedSystem.status}</span></p>

                        {selectedSystem.parts.map((part) => (
                            <div key={part._id} className="border rounded-lg p-4 bg-gray-50">
                                <h3 className="font-semibold text-gray-800 mb-2">Part: {part.partType}</h3>
                                <p><strong>Model:</strong> {part.model ?? "N/A"}</p>
                                <p><strong>Brand:</strong> {part.brand ?? "N/A"}</p>
                                <p><strong>Multiple Systems:</strong> {part.isMultiple ? "Yes" : "No"}</p>
                                <p><strong>Status:</strong>
                                    <span className={part.status === "Active" ? "text-green-600" : "text-red-600"}> {part.status ?? "N/A"}</span>
                                </p>
                                <p><strong>Unusable Reason:</strong> {part.unusableReason ?? "N/A"}</p>
                                <p><strong>Barcode:</strong> {part.barcode ?? "N/A"}</p>
                                <p><strong>Serial Number:</strong> {part.serialNumber ?? "N/A"}</p>
                                <p><strong>Notes:</strong> {part.notes || 'N/A'}</p>
                                {part.specs?.length > 0 ? (
                                    <>
                                        <p><strong>Specs:</strong></p>
                                        <ul className="list-disc ml-5">
                                            {part.specs.map((spec, idx) => (
                                                <li key={idx}>{spec.key}: {spec.value}</li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p><strong>Specs:</strong> N/A</p>
                                )}
                            </div>
                        ))}
                    </div>
                </Modal>
            )}


        </div>
    );
};

const Modal = ({ title, children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scroll">
                <div className="flex justify-between items-center mb-4 ">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 text-3xl hover:text-black">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default SystemListPage;
