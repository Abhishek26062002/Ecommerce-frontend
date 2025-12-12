import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import MachineryCard from '../components/MachineryCard';
import { api } from '../utils/api';
import { showToast } from '../utils/helpers';

const Machinery = () => {
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMachinery = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.fetchMachinery();
        console.log('Fetched machinery data:', data);
        const machineryList = Array.isArray(data) ? data : (data.machines || data || []);
        setMachinery(machineryList);
      } catch (err) {
        console.error('Error fetching machinery:', err);
        setError(err.message || 'Failed to load machinery');
        showToast('Failed to load machinery', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMachinery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 md:py-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
          </div>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6'>
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-300 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
        
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          <p className="text-gray-800 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (machinery.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔧</div>
          <p className="text-gray-600 font-medium">No machinery available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Machinery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our premium collection of embroidery machinery and equipment
          </p>
        </div>

        {/* Machinery Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {machinery.map((item) => (
            <MachineryCard key={item.id} machinery={item} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Machinery;
