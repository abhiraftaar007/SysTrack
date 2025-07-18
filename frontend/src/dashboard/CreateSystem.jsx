import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from "lucide-react";
import { toast } from "react-toastify";

const CreateSystem = ({ onClose }) => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const [name, setName] = useState('');
    const [selectedPartIds, setSelectedPartIds] = useState([]);

    const fetchFreeParts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/part/freeparts');
            setParts(res.data.parts);
        } catch (err) {
            setError('Failed to fetch parts');
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFreeParts();
    }, []);

    useEffect(() => {
        console.log(name, selectedPartIds);
    }, [name, selectedPartIds])

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handlePartSelect = (e) => {
        const value = e.target.value;
        setSelectedPartIds((prevIds) => {
            if (prevIds.includes(value)) return prevIds;
            return [...prevIds, value];
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !selectedPartIds) {
            toast.error("Please enter the required details");
            return;
        };

        try {
            const res = await axios.post('http://localhost:5000/api/system/', {
                name,
                parts: selectedPartIds
            });
            toast.success(res.data.message);
            onClose();
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(err.response.data.errors);
            } else {
                console.error("Unexpected error:", err);
            }
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <p className="text-lg font-medium text-gray-600 animate-pulse">Loading parts...</p>
            </div>
        );
    }
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 w-full max-w-lg relative">
                <button
                    onClick={onClose}
                    className="absolute rounded-lg top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    <X size={24} />
                </button>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* System Name */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">System Name</label>
                        <input
                            name="name"
                            onChange={handleNameChange}
                            value={name}
                            className={`w-full p-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="Enter system name"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    {/* Part Select by Barcode */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">
                            Select Part (by Barcode)
                        </label>
                        <select
                            name="selectedPartId"
                            className={`w-full p-2 border rounded-lg ${errors.selectedPartId ? 'border-red-500' : ''}`}
                            onChange={handlePartSelect}
                            value=""
                        >
                            <option value="">-- Select Part --</option>
                            {parts.map(part => (
                                <option key={part._id} value={part._id}>
                                    {part.barcode}
                                </option>
                            ))}
                        </select>

                        <ul className='mt-2 text-sm text-gray-600 list-disc list-inside'>
                            {selectedPartIds.map(id => {
                                const part = parts.find(p => p._id === id);
                                return <li key={id}>{part?.barcode ?? 'Unknown'}</li>
                            })
                            }
                        </ul>
                        {errors.selectedPartId && (
                            <p className="text-red-500 text-sm">{errors.selectedPartId}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add System
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateSystem;
