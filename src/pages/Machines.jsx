import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import EmbroideryMachineCard from '../components/EmbroideryMachineCard';
import MachineryBasketSidebar from '../components/MachineryBasketSidebar';
import { api } from '../utils/api';
import { showToast } from '../utils/helpers';

const Machines = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMachinesData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.fetchEmbroideryMachines();
        console.log('Machines data fetched:', data);
        const machinesList = Array.isArray(data) ? data : (data.machines || data || []);
        setMachines(machinesList);
      } catch (err) {
        console.error('Error fetching machines:', err);
        setError(err.message || 'Failed to load machines');
        showToast('Failed to load machines', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMachinesData();
  }, []);

  if (loading) {
    return (
      <>
        <MachineryBasketSidebar />
        <div className="min-h-screen bg-gray-50 px-1 py-4 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-300 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="bg-gray-100 p-3 rounded-lg space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
                      ))}
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="space-y-1">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
          <p className="text-gray-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MachineryBasketSidebar />
      <div className="min-h-screen bg-gray-50 px-1 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Embroidery Machines</h1>
          <p className="text-lg text-gray-600">Professional embroidery machines for your business</p>
          {machines.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">{machines.length} machines available</p>
          )}
        </div>

        {/* Machines Grid */}
        {machines.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No machines available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <EmbroideryMachineCard key={machine.machine_id} machine={machine} />
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default Machines;
