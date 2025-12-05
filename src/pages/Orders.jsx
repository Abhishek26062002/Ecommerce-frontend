import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Download, LogOut } from 'lucide-react';
import Tabs from '../components/Tabs';
import useAuthStore from '../store/useAuthStore';
import { api } from '../utils/api';
import { formatDate, formatPrice, showToast } from '../utils/helpers';

const Orders = ({openLogin}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) { 
    openLogin();  
    }

    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'downloads') {
      fetchDownloads();
    }
  }, [isAuthenticated, activeTab, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await api.getAll();
      setOrders(response.data || mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders(mockOrders);
    }
  };

  const fetchDownloads = async () => {
    try {
      const response = await api.getAll();
      setDownloads(response.data || mockDownloads);
    } catch (error) {
      console.error('Error fetching downloads:', error);
      setDownloads(mockDownloads);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Order History' },
    { id: 'downloads', label: 'Downloads' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-6">
              {activeTab === 'profile' && <ProfileTab user={user} />}
              {activeTab === 'orders' && <OrdersTab orders={orders} />}
              {activeTab === 'downloads' && <DownloadsTab downloads={downloads} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ user }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Profile updated successfully', 'success');
    setEditing(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-red-100 p-4 rounded-full">
          <User className="h-12 w-12 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

const OrdersTab = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-800">Order #{order.id}</p>
              <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-red-600">{formatPrice(order.total)}</p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {order.status}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </div>
        </div>
      ))}
    </div>
  );
};

const DownloadsTab = ({ downloads }) => {
  const handleDownload = (download) => {
    showToast(`Downloading ${download.name}...`, 'success');
  };

  if (downloads.length === 0) {
    return (
      <div className="text-center py-12">
        <Download className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No downloads available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {downloads.map((download) => (
        <div key={download.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">{download.name}</p>
            <p className="text-sm text-gray-600">
              Purchased on {formatDate(download.purchaseDate)}
            </p>
            <div className="flex gap-2 mt-2">
              {download.formats.map((format) => (
                <span key={format} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {format}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => handleDownload(download)}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      ))}
    </div>
  );
};

const mockOrders = [
  { id: 1001, date: '2025-10-01', total: 899, status: 'Completed', items: ['Floral Design', 'Saree Border'] },
  { id: 1002, date: '2025-09-15', total: 449, status: 'Completed', items: ['Kurthi Pattern'] },
];

const mockDownloads = [
  { id: 1, name: 'Floral Blouse Design', purchaseDate: '2025-10-01', formats: ['DST', 'JEF'] },
  { id: 2, name: 'Traditional Saree Border', purchaseDate: '2025-10-01', formats: ['DST', 'JEF'] },
  { id: 3, name: 'Modern Kurthi Pattern', purchaseDate: '2025-09-15', formats: ['DST', 'JEF'] },
];

export default Orders;
