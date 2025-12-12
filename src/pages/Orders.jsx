import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Download } from 'lucide-react';
import Tabs from '../components/Tabs';
import useAuthStore from '../store/useAuthStore';
import { api } from '../utils/api';
import { formatDate, formatPrice, showToast } from '../utils/helpers';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingDownloads, setLoadingDownloads] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'downloads') {
      fetchDownloads();
    }
  }, [isAuthenticated, activeTab, navigate]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const userId = localStorage.getItem('osa-userId');
      if (!userId) {
        console.error('No userId found');
        setOrders([]);
        return;
      }

      const response = await api.getOrderHistory(userId);
      console.log('Order history data:', response);
      setOrders(response || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      showToast('Failed to fetch orders', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchDownloads = async () => {
    try {
      setLoadingDownloads(true);
      const userId = localStorage.getItem('osa-userId');
      if (!userId) {
        console.error('No userId found');
        setDownloads([]);
        return;
      }

      const response = await api.getOrders(userId);
      console.log('Downloads response (raw):', response);
      
      // Transform orders response to downloads format
      // Response structure: [{order_id, product_id, product_name, selected_type, quantity, price, images, category, ...}]
      const formattedDownloads = response.map(item => ({
        id: item.order_item_id,
        name: item.product_name,
        purchaseDate: item.created_at || new Date().toISOString(),
        formats: [item.selected_type],
        productId: item.product_id,
        category: item.category,
        price: item.price,
        image: item.images?.[0],
        images: item.images,
        orderId: item.order_id,
        paymentId: item.payment_id,
        quantity: item.quantity
      }));
      
      console.log('Formatted downloads:', formattedDownloads);
      setDownloads(formattedDownloads || []);
    } catch (error) {
      console.error('Error fetching downloads:', error);
      setDownloads([]);
      showToast('Failed to fetch downloads', 'error');
    } finally {
      setLoadingDownloads(false);
    }
  };

  const tabs = [
    { id: 'orders', label: 'Order History' },
    { id: 'downloads', label: 'Downloads' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          </div>

          <div className="p-6">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-6">
              {activeTab === 'orders' && <OrdersTab orders={orders} loading={loadingOrders} />}
              {activeTab === 'downloads' && <DownloadsTab downloads={downloads} loading={loadingDownloads} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading Components
const OrderSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div>
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="text-right">
        <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-48"></div>
  </div>
);

const DownloadSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-start gap-4 animate-pulse">

    {/* LEFT SECTION → Image + Text (wrapped in flex-row on md) */}
    <div className="flex flex-row gap-4 flex-1 w-full">

      {/* Image Placeholder */}
      <div className="w-24 h-24 bg-gray-300 rounded-lg shrink-0"></div>

      {/* Text Block */}
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-40"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
        <div className="h-3 bg-gray-200 rounded w-36"></div>

        {/* File Formats */}
        <div className="flex gap-2 mt-2">
          <div className="h-6 bg-gray-300 rounded w-14"></div>
          <div className="h-6 bg-gray-300 rounded w-14"></div>
        </div>
      </div>
    </div>

    {/* BUTTON (BOTTOM ON MOBILE, RIGHT ON DESKTOP) */}
    <div className="w-full md:w-24 h-10 bg-gray-300 rounded-lg shrink-0"></div>

  </div>
);


const OrdersTab = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <OrderSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No orders yet</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-800">{order.id.substring(0, 8)}...</p>
              <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-red-600">{formatPrice(order.total_amount)}</p>
              <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          {order.payment_id && (
            <p className="text-xs text-gray-500 mt-2">Payment ID: {order.payment_id}</p>
          )}
          <p className="text-xs text-gray-500">Last updated: {formatDate(order.updated_at)}</p>
        </div>
      ))}
    </div>
  );
};

const DownloadsTab = ({ downloads, loading }) => {
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (download) => {
    // Use selected_type (DST/JEF) from the download object
    const fileType = download.formats[0]?.toLowerCase() || 'dst';
    
    // Use paymentId from the download object
    const paymentId = download.paymentId;

    const productId = download.productId;

    if (!paymentId) {
      showToast('Payment ID not found for this download', 'error');
      return;
    }

    setDownloading(download.id);
    
    try {
      console.log(`Downloading ${fileType} for payment ${paymentId}`);
      
      // Call backend to get download URL
      const response = await api.getProductDownloadUrl(paymentId, productId, fileType);
      
      // Get the appropriate URL from response
      const downloadUrl = response[`${fileType}_url`];
      
      if (!downloadUrl) {
        showToast(`Download URL not available for ${fileType}`, 'error');
        return;
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${download.name}-${fileType}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`${download.name} (${fileType.toUpperCase()}) downloaded successfully!`, 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast(error.message || `Failed to download ${fileType}`, 'error');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <DownloadSkeleton key={i} />
        ))}
      </div>
    );
  }

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
        <div key={download.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Product Image */}
            <div className="flex items-center gap-4 flex-1">
            {download.image && (
              <img
                src={download.image}
                alt={download.name}
                className="w-24 h-24 object-cover rounded-lg shrink-0"
              />
            )}
            
            {/* Product Details */}
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{download.name}</p>
              {download.category && (
                <p className="text-sm text-gray-600">Category: {download.category}</p>
              )}
              <p className="text-sm text-gray-600">
                Unlimited downloads
              </p>
              <div className="flex gap-2 mt-2">
                {download.formats.map((format) => (
                  <span key={format} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    {format}
                  </span>
                ))}
              </div>
              {download.price && (
                <p className="text-sm hidden md:block font-medium text-red-600 mt-2">{formatPrice(download.price)}</p>
              )}
            </div>
</div>
            {/* Download Button */}
            <button
              onClick={() => handleDownload(download)}
              disabled={downloading === download.id}
              className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed md:h-fit"
            >
              <Download className="h-4 w-4" />
              <span>{downloading === download.id ? 'Downloading...' : 'Download'}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
