import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSystems } from '../context/SystemContext';

const SystemListPage = () => {
    const { systems, setSystems } = useSystems();
    const navigate = useNavigate();

    return (
        <div className="w-full px-6 py-4 relative">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Total Systems ({systems.length})
                </h1>
                <button
                    onClick={() => navigate('/superadmin')}
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Content Section */}
            <div className="px-6 py-4">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 items-stretch">
                    {systems.map((system, idx) => (
                        <div
                            key={system._id}
                            className="bg-white rounded-xl shadow p-5 border border-gray-200 w-full"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                System #{idx + 1}
                            </h2>
                            <p>
                                <span className="font-medium">Status:</span> {system.status}
                            </p>
                            <p>
                                <span className="font-medium">Assigned To:</span>{' '}
                                {system.assignedTo || 'Not assigned'}
                            </p>

                            <p className="mt-4 font-semibold">Parts:</p>
                            {system.parts.length === 0 ? (
                                <p className="text-gray-500 italic">No parts added.</p>
                            ) : (
                                <div className="overflow-x-auto mt-2">
                                    <table className="w-full text-sm text-left border border-gray-300 min-w-[600px]">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-3 py-2 border">Type</th>
                                                <th className="px-3 py-2 border">Brand</th>
                                                <th className="px-3 py-2 border">Model</th>
                                                <th className="px-3 py-2 border">Serial</th>
                                                <th className="px-3 py-2 border">Status</th>
                                                <th className="px-3 py-2 border">Specs</th>
                                                <th className="px-3 py-2 border">Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {system.parts.map((part) => (
                                                <tr key={part._id} className="border-t">
                                                    <td className="px-3 py-2">{part.type}</td>
                                                    <td className="px-3 py-2">{part.brand}</td>
                                                    <td className="px-3 py-2">{part.model}</td>
                                                    <td className="px-3 py-2">{part.serialNumber}</td>
                                                    <td className="px-3 py-2">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-semibold text-white rounded ${part.status === 'active'
                                                                ? 'bg-green-500'
                                                                : 'bg-red-500'
                                                                }`}
                                                        >
                                                            {part.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {Object.entries(part.specs || {}).map(([k, v]) => (
                                                            <div key={k}>
                                                                <strong>{k}:</strong> {v}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="px-3 py-2 text-red-600 italic">
                                                        {part.unusableReason || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SystemListPage;
