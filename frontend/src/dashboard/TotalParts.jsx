import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParts } from '../context/PartsContext';

const TotalParts = () => {
    const { parts, setParts } = useParts();
    const navigate = useNavigate();

    return (
        <div className="w-full px-6 py-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Total Parts ({parts.length})</h2>
                <button
                    onClick={() => navigate('/superadmin')}
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="flex flex-col gap-6">
                {parts.map((part) => (
                    <div
                        key={part._id}
                        className="flex flex-col border border-gray-300 rounded-xl shadow-sm bg-white p-6 w-full"
                    >
                        <div className="flex flex-wrap justify-between gap-4">
                            <div className="min-w-[200px]">
                                <h3 className="text-lg font-semibold text-gray-800">{part.type}</h3>
                                <p className="text-sm text-gray-600"><span className="font-medium">Brand:</span> {part.brand}</p>
                                <p className="text-sm text-gray-600"><span className="font-medium">Model:</span> {part.model}</p>
                                <p className="text-sm text-gray-600"><span className="font-medium">Serial Number:</span> {part.serialNumber}</p>
                                <p className="text-sm text-gray-600"><span className="font-medium">Barcode:</span> {part.barcode}</p>
                            </div>

                            <div className="min-w-[200px]">
                                <p className="text-sm">
                                    <span className="font-medium">Status:</span>{' '}
                                    <span className={`font-semibold ${part.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                                        {part.status}
                                    </span>
                                </p>
                                {part.unusableReason && (
                                    <p className="text-sm text-red-500 italic">
                                        <span className="font-medium">Reason:</span> {part.unusableReason}
                                    </p>
                                )}
                            </div>

                            {part.specs && (
                                <div className="min-w-full sm:min-w-[250px] mt-2">
                                    <p className="text-sm font-medium mb-1">Specifications:</p>
                                    {Object.entries(part.specs).map(([key, value]) => (
                                        <p key={key} className="text-sm text-gray-600">
                                            <span className="capitalize font-medium">{key}:</span> {value}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TotalParts;
