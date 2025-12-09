import { useState, useEffect } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-red-600 animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">Loading machinery...</p>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {machinery.map((item) => (
            <MachineryCard key={item.id} machinery={item} />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Our Machinery?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-3xl">⚙️</div>
              <h3 className="font-semibold text-gray-800">High Performance</h3>
              <p className="text-gray-600 text-sm">
                Industrial-grade machinery built for precision and durability
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🛠️</div>
              <h3 className="font-semibold text-gray-800">Expert Support</h3>
              <p className="text-gray-600 text-sm">
                Dedicated technical support and maintenance guidance included
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">💼</div>
              <h3 className="font-semibold text-gray-800">Best Pricing</h3>
              <p className="text-gray-600 text-sm">
                Competitive rates with flexible payment options available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Machinery;
