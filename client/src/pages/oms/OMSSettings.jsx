import React, { useState, useEffect } from 'react';
import { 
  FiSettings, 
  FiShield, 
  FiBell, 
  FiGlobe, 
  FiTruck,
  FiDollarSign,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiCreditCard,
  FiPackage
} from 'react-icons/fi';
import Axios from '../../utils/Axios';
import toast from 'react-hot-toast';

const OMSSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [settings, setSettings] = useState({
    // General Store Settings
    general: {
      storeName: '',
      storeDescription: '',
      storeEmail: '',
      storePhone: '',
      storeAddress: '',
      storeCity: '',
      storeState: '',
      storePincode: '',
      storeCountry: 'India',
      businessType: 'retail',
      gstNumber: '',
      panNumber: ''
    },
    
    // ShipRocket Integration
    shipping: {
      shiprocketEmail: '',
      shiprocketPassword: '',
      shiprocketToken: '',
      shiprocketChannelId: '',
      defaultPickupLocation: '',
      defaultLength: '10',
      defaultBreadth: '10',
      defaultHeight: '10',
      defaultWeight: '0.5',
      enableCOD: true,
      enablePrepaid: true,
      autoCreateShipment: false,
      defaultCourier: 'auto'
    },
    
    // Payment Settings
    payment: {
      razorpayKeyId: '',
      razorpayKeySecret: '',
      enableRazorpay: true,
      enableCOD: true,
      codCharges: '0',
      minOrderAmount: '0',
      maxCODAmount: '50000'
    },
    
    // Notification Settings
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      orderConfirmation: true,
      orderShipped: true,
      orderDelivered: true,
      lowStock: true,
      newCustomer: false,
      dailyReport: true,
      weeklyReport: true
    },
    
    // Security Settings
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      allowedIPs: '',
      passwordPolicy: 'medium'
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'shipping', label: 'Shipping (ShipRocket)', icon: FiTruck },
    { id: 'payment', label: 'Payment', icon: FiDollarSign },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiShield }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await Axios({ url: '/api/settings', method: 'GET' });
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (section) => {
    try {
      setLoading(true);
      const response = await Axios({
        url: '/api/settings',
        method: 'POST',
        data: { section, settings: settings[section] }
      });
      
      if (response.data.success) {
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
      }
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const testShipRocketConnection = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        url: '/api/settings/shiprocket/test-connection',
        method: 'POST',
        data: {
          email: settings.shipping.shiprocketEmail,
          password: settings.shipping.shiprocketPassword
        }
      });
      
      if (response.data.success) {
        setSettings(prev => ({
          ...prev,
          shipping: {
            ...prev.shipping,
            shiprocketToken: response.data.data.token,
            shiprocketChannelId: response.data.data.channelId || ''
          }
        }));
        toast.success('ShipRocket connection successful!');
      } else {
        toast.error('Failed to connect to ShipRocket. Please check credentials.');
      }
    } catch (error) {
      toast.error('Error testing ShipRocket connection');
      console.error('ShipRocket connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Name *</label>
          <input
            type="text"
            value={settings.general.storeName}
            onChange={(e) => updateSetting('general', 'storeName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Mindzspark Shop"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
          <select
            value={settings.general.businessType}
            onChange={(e) => updateSetting('general', 'businessType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="retail">Retail</option>
            <option value="wholesale">Wholesale</option>
            <option value="manufacturer">Manufacturer</option>
            <option value="distributor">Distributor</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
        <textarea
          value={settings.general.storeDescription}
          onChange={(e) => updateSetting('general', 'storeDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your store..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Email *</label>
          <input
            type="email"
            value={settings.general.storeEmail}
            onChange={(e) => updateSetting('general', 'storeEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="store@mindzspark.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Phone *</label>
          <input
            type="tel"
            value={settings.general.storePhone}
            onChange={(e) => updateSetting('general', 'storePhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+91 9876543210"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Store Address *</label>
        <input
          type="text"
          value={settings.general.storeAddress}
          onChange={(e) => updateSetting('general', 'storeAddress', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Complete address with landmark"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input
            type="text"
            value={settings.general.storeCity}
            onChange={(e) => updateSetting('general', 'storeCity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="City"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <input
            type="text"
            value={settings.general.storeState}
            onChange={(e) => updateSetting('general', 'storeState', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="State"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
          <input
            type="text"
            value={settings.general.storePincode}
            onChange={(e) => updateSetting('general', 'storePincode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123456"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <select
            value={settings.general.storeCountry}
            onChange={(e) => updateSetting('general', 'storeCountry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
          <input
            type="text"
            value={settings.general.gstNumber}
            onChange={(e) => updateSetting('general', 'gstNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="22AAAAA0000A1Z5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
          <input
            type="text"
            value={settings.general.panNumber}
            onChange={(e) => updateSetting('general', 'panNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ABCDE1234F"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveSettings('general')}
          disabled={loading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <FiSave className="w-4 h-4 mr-2" />
          Save General Settings
        </button>
      </div>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-2">ShipRocket Integration</h3>
        <p className="text-sm text-blue-700">
          Connect your ShipRocket account to automate shipping and tracking. 
          <a href="https://www.shiprocket.in/" target="_blank" rel="noopener noreferrer" className="underline ml-1">
            Create ShipRocket account
          </a>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ShipRocket Email *</label>
          <input
            type="email"
            value={settings.shipping.shiprocketEmail}
            onChange={(e) => updateSetting('shipping', 'shiprocketEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your-email@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ShipRocket Password *</label>
          <div className="relative">
            <input
              type={showPassword.shiprocketPassword ? 'text' : 'password'}
              value={settings.shipping.shiprocketPassword}
              onChange={(e) => updateSetting('shipping', 'shiprocketPassword', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your ShipRocket password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('shiprocketPassword')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword.shiprocketPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={testShipRocketConnection}
          disabled={loading || !settings.shipping.shiprocketEmail || !settings.shipping.shiprocketPassword}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <FiRefreshCw className="w-4 h-4 mr-2" />
          Test Connection
        </button>
        
        {settings.shipping.shiprocketToken && (
          <div className="flex items-center text-green-600">
            <FiCheck className="w-4 h-4 mr-2" />
            Connected Successfully
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Channel ID</label>
          <input
            type="text"
            value={settings.shipping.shiprocketChannelId}
            onChange={(e) => updateSetting('shipping', 'shiprocketChannelId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Auto-generated after connection"
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Default Pickup Location</label>
          <input
            type="text"
            value={settings.shipping.defaultPickupLocation}
            onChange={(e) => updateSetting('shipping', 'defaultPickupLocation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Primary pickup location"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Default Package Dimensions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
            <input
              type="number"
              value={settings.shipping.defaultLength}
              onChange={(e) => updateSetting('shipping', 'defaultLength', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Breadth (cm)</label>
            <input
              type="number"
              value={settings.shipping.defaultBreadth}
              onChange={(e) => updateSetting('shipping', 'defaultBreadth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
            <input
              type="number"
              value={settings.shipping.defaultHeight}
              onChange={(e) => updateSetting('shipping', 'defaultHeight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={settings.shipping.defaultWeight}
              onChange={(e) => updateSetting('shipping', 'defaultWeight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Shipping Options</h4>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.shipping.enableCOD}
              onChange={(e) => updateSetting('shipping', 'enableCOD', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Cash on Delivery</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.shipping.enablePrepaid}
              onChange={(e) => updateSetting('shipping', 'enablePrepaid', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Prepaid Orders</span>
          </label>
        </div>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.shipping.autoCreateShipment}
            onChange={(e) => updateSetting('shipping', 'autoCreateShipment', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Auto-create shipments for confirmed orders</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveSettings('shipping')}
          disabled={loading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <FiSave className="w-4 h-4 mr-2" />
          Save Shipping Settings
        </button>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-purple-900 mb-2">Payment Gateway Integration</h3>
        <p className="text-sm text-purple-700">
          Configure your payment gateways to accept online payments.
        </p>
      </div>

      <div className="space-y-6">
        <h4 className="font-medium text-gray-900">Razorpay Configuration</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay Key ID *</label>
            <input
              type="text"
              value={settings.payment.razorpayKeyId}
              onChange={(e) => updateSetting('payment', 'razorpayKeyId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="rzp_test_xxxxxxxxxx"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay Key Secret *</label>
            <div className="relative">
              <input
                type={showPassword.razorpayKeySecret ? 'text' : 'password'}
                value={settings.payment.razorpayKeySecret}
                onChange={(e) => updateSetting('payment', 'razorpayKeySecret', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Razorpay secret key"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('razorpayKeySecret')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword.razorpayKeySecret ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Payment Options</h4>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.payment.enableRazorpay}
              onChange={(e) => updateSetting('payment', 'enableRazorpay', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Razorpay</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.payment.enableCOD}
              onChange={(e) => updateSetting('payment', 'enableCOD', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Cash on Delivery</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">COD Charges (₹)</label>
          <input
            type="number"
            value={settings.payment.codCharges}
            onChange={(e) => updateSetting('payment', 'codCharges', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Amount (₹)</label>
          <input
            type="number"
            value={settings.payment.minOrderAmount}
            onChange={(e) => updateSetting('payment', 'minOrderAmount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max COD Amount (₹)</label>
          <input
            type="number"
            value={settings.payment.maxCODAmount}
            onChange={(e) => updateSetting('payment', 'maxCODAmount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50000"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveSettings('payment')}
          disabled={loading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <FiSave className="w-4 h-4 mr-2" />
          Save Payment Settings
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-900 mb-2">Notification Preferences</h3>
        <p className="text-sm text-yellow-700">
          Configure how and when you want to receive notifications about your store activities.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Communication Channels</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.smsNotifications}
                onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">SMS Notifications</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Order Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.orderConfirmation}
                onChange={(e) => updateSetting('notifications', 'orderConfirmation', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Order Confirmation</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.orderShipped}
                onChange={(e) => updateSetting('notifications', 'orderShipped', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Order Shipped</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.orderDelivered}
                onChange={(e) => updateSetting('notifications', 'orderDelivered', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Order Delivered</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Business Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.lowStock}
                onChange={(e) => updateSetting('notifications', 'lowStock', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Low Stock Alerts</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.newCustomer}
                onChange={(e) => updateSetting('notifications', 'newCustomer', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">New Customer Registration</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Reports</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.dailyReport}
                onChange={(e) => updateSetting('notifications', 'dailyReport', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Daily Sales Report</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.weeklyReport}
                onChange={(e) => updateSetting('notifications', 'weeklyReport', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Weekly Performance Report</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveSettings('notifications')}
          disabled={loading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <FiSave className="w-4 h-4 mr-2" />
          Save Notification Settings
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-red-900 mb-2">Security Settings</h3>
        <p className="text-sm text-red-700">
          Configure security settings to protect your seller account and store data.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Account Security</h4>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <select
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                <select
                  value={settings.security.passwordPolicy}
                  onChange={(e) => updateSetting('security', 'passwordPolicy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low (6+ characters)</option>
                  <option value="medium">Medium (8+ chars, mixed case)</option>
                  <option value="high">High (12+ chars, mixed case, numbers, symbols)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Access Control</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed IP Addresses (comma-separated, leave empty for all)
            </label>
            <textarea
              value={settings.security.allowedIPs}
              onChange={(e) => updateSetting('security', 'allowedIPs', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="192.168.1.1, 203.0.113.0/24"
            />
            <p className="text-xs text-gray-500 mt-1">
              Restrict admin access to specific IP addresses for enhanced security
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveSettings('security')}
          disabled={loading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <FiSave className="w-4 h-4 mr-2" />
          Save Security Settings
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'shipping':
        return renderShippingSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
          <p className="text-gray-600">Configure your store preferences and integrations</p>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default OMSSettings;