import React, { useState, useEffect } from 'react';
import { Car, CreditCard, BarChart3, Settings, Wifi, WifiOff, Clock, Users, DollarSign, Activity } from 'lucide-react';

interface ParkingSpace {
  id: string;
  number: number;
  isOccupied: boolean;
  rfidCard?: string;
  userInfo?: {
    name: string;
    vehicle: string;
    checkInTime: Date;
  };
  level: number;
  zone: string;
}

interface RFIDCard {
  id: string;
  cardNumber: string;
  userName: string;
  vehicle: string;
  status: 'active' | 'inactive' | 'blocked';
  balance: number;
  lastUsed?: Date;
}

interface IoTDevice {
  id: string;
  name: string;
  type: 'rfid-reader' | 'sensor' | 'barrier';
  status: 'online' | 'offline';
  location: string;
  lastPing: Date;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [rfidCards, setRfidCards] = useState<RFIDCard[]>([]);
  const [iotDevices, setIoTDevices] = useState<IoTDevice[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialize mock data
  useEffect(() => {
    const initializeParkingSpaces = () => {
      const spaces: ParkingSpace[] = [];
      for (let level = 1; level <= 3; level++) {
        for (let i = 1; i <= 20; i++) {
          const spaceNumber = (level - 1) * 20 + i;
          const isOccupied = Math.random() > 0.6;
          spaces.push({
            id: `space-${spaceNumber}`,
            number: spaceNumber,
            isOccupied,
            level,
            zone: level === 1 ? 'Ground' : level === 2 ? 'Level 1' : 'Level 2',
            ...(isOccupied && {
              rfidCard: `RFID-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
              userInfo: {
                name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
                vehicle: ['BMW X5', 'Toyota Camry', 'Honda Civic', 'Ford F-150'][Math.floor(Math.random() * 4)],
                checkInTime: new Date(Date.now() - Math.random() * 3600000 * 5),
              },
            }),
          });
        }
      }
      setParkingSpaces(spaces);
    };

    const initializeRFIDCards = () => {
      const cards: RFIDCard[] = [
        {
          id: '1',
          cardNumber: 'RFID-0001',
          userName: 'John Doe',
          vehicle: 'BMW X5 - ABC123',
          status: 'active',
          balance: 125.50,
          lastUsed: new Date(Date.now() - 1800000),
        },
        {
          id: '2',
          cardNumber: 'RFID-0002',
          userName: 'Jane Smith',
          vehicle: 'Toyota Camry - XYZ789',
          status: 'active',
          balance: 89.25,
          lastUsed: new Date(Date.now() - 3600000),
        },
        {
          id: '3',
          cardNumber: 'RFID-0003',
          userName: 'Mike Johnson',
          vehicle: 'Honda Civic - DEF456',
          status: 'blocked',
          balance: 5.00,
          lastUsed: new Date(Date.now() - 86400000),
        },
        {
          id: '4',
          cardNumber: 'RFID-0004',
          userName: 'Sarah Wilson',
          vehicle: 'Ford F-150 - GHI789',
          status: 'active',
          balance: 200.00,
          lastUsed: new Date(Date.now() - 900000),
        },
      ];
      setRfidCards(cards);
    };

    const initializeIoTDevices = () => {
      const devices: IoTDevice[] = [
        {
          id: '1',
          name: 'Entry Gate Reader',
          type: 'rfid-reader',
          status: 'online',
          location: 'Main Entrance',
          lastPing: new Date(Date.now() - 30000),
        },
        {
          id: '2',
          name: 'Exit Gate Reader',
          type: 'rfid-reader',
          status: 'online',
          location: 'Main Exit',
          lastPing: new Date(Date.now() - 45000),
        },
        {
          id: '3',
          name: 'Level 1 Sensors',
          type: 'sensor',
          status: 'online',
          location: 'Ground Floor',
          lastPing: new Date(Date.now() - 20000),
        },
        {
          id: '4',
          name: 'Level 2 Sensors',
          type: 'sensor',
          status: 'offline',
          location: 'Level 1',
          lastPing: new Date(Date.now() - 300000),
        },
        {
          id: '5',
          name: 'Entry Barrier',
          type: 'barrier',
          status: 'online',
          location: 'Main Entrance',
          lastPing: new Date(Date.now() - 15000),
        },
      ];
      setIoTDevices(devices);
    };

    initializeParkingSpaces();
    initializeRFIDCards();
    initializeIoTDevices();
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParkingSpaces(prev => {
        const newSpaces = [...prev];
        const randomIndex = Math.floor(Math.random() * newSpaces.length);
        const space = newSpaces[randomIndex];
        
        if (Math.random() > 0.95) { // 5% chance of change
          if (space.isOccupied) {
            // Vehicle leaves
            newSpaces[randomIndex] = {
              ...space,
              isOccupied: false,
              rfidCard: undefined,
              userInfo: undefined,
            };
          } else {
            // Vehicle arrives
            newSpaces[randomIndex] = {
              ...space,
              isOccupied: true,
              rfidCard: `RFID-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
              userInfo: {
                name: ['Alex Brown', 'Emma Davis', 'Chris Lee', 'Lisa Anderson'][Math.floor(Math.random() * 4)],
                vehicle: ['Tesla Model 3', 'Audi A4', 'Mercedes C-Class', 'Nissan Altima'][Math.floor(Math.random() * 4)],
                checkInTime: new Date(),
              },
            };
          }
        }
        
        return newSpaces;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const occupiedSpaces = parkingSpaces.filter(space => space.isOccupied).length;
  const totalSpaces = parkingSpaces.length;
  const occupancyRate = totalSpaces > 0 ? (occupiedSpaces / totalSpaces) * 100 : 0;
  const onlineDevices = iotDevices.filter(device => device.status === 'online').length;
  const activeCards = rfidCards.filter(card => card.status === 'active').length;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'parking', label: 'Parking Grid', icon: Car },
    { id: 'rfid', label: 'RFID Cards', icon: CreditCard },
    { id: 'devices', label: 'IoT Devices', icon: Wifi },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Spaces</p>
              <p className="text-2xl font-bold text-white">{totalSpaces}</p>
            </div>
            <Car className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Occupied</p>
              <p className="text-2xl font-bold text-white">{occupiedSpaces}</p>
            </div>
            <Activity className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Cards</p>
              <p className="text-2xl font-bold text-white">{activeCards}</p>
            </div>
            <CreditCard className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Online Devices</p>
              <p className="text-2xl font-bold text-white">{onlineDevices}/{iotDevices.length}</p>
            </div>
            <Wifi className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Occupancy Overview */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Occupancy Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Current Occupancy</span>
            <span className="text-white font-semibold">{occupancyRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-400">Available</p>
              <p className="text-green-400 font-semibold">{totalSpaces - occupiedSpaces}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Occupied</p>
              <p className="text-red-400 font-semibold">{occupiedSpaces}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Total</p>
              <p className="text-blue-400 font-semibold">{totalSpaces}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {parkingSpaces
            .filter(space => space.isOccupied && space.userInfo)
            .slice(0, 5)
            .map(space => (
              <div key={space.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">{space.userInfo?.name}</p>
                    <p className="text-gray-400 text-sm">Space {space.number} • {space.zone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Check-in</p>
                  <p className="text-white text-sm">
                    {space.userInfo?.checkInTime.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderParkingGrid = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Parking Grid</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Occupied</span>
          </div>
        </div>
      </div>

      {/* Level tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        {[1, 2, 3].map(level => (
          <button
            key={level}
            className="flex-1 py-2 px-4 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          >
            {level === 1 ? 'Ground Floor' : `Level ${level - 1}`}
          </button>
        ))}
      </div>

      {/* Parking spaces grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-10 gap-3">
        {parkingSpaces.slice(0, 20).map(space => (
          <div
            key={space.id}
            className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300 cursor-pointer hover:scale-105 ${
              space.isOccupied
                ? 'bg-red-500 border-red-400 text-white'
                : 'bg-green-500 border-green-400 text-white hover:bg-green-400'
            }`}
            title={space.isOccupied ? `Occupied by ${space.userInfo?.name}` : 'Available'}
          >
            {space.number}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRFIDCards = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">RFID Card Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add New Card
        </button>
      </div>

      <div className="grid gap-4">
        {rfidCards.map(card => (
          <div key={card.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  card.status === 'active' ? 'bg-green-500' : card.status === 'blocked' ? 'bg-red-500' : 'bg-gray-500'
                }`}>
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{card.userName}</h3>
                  <p className="text-gray-400 text-sm">{card.cardNumber}</p>
                  <p className="text-gray-400 text-sm">{card.vehicle}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  card.status === 'active' ? 'bg-green-100 text-green-800' : 
                  card.status === 'blocked' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                </div>
                <p className="text-white font-semibold mt-1">${card.balance.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">
                  Last used: {card.lastUsed?.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIoTDevices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">IoT Device Status</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-sm">Live Status</span>
        </div>
      </div>

      <div className="grid gap-4">
        {iotDevices.map(device => (
          <div key={device.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {device.status === 'online' ? <Wifi className="w-6 h-6 text-white" /> : <WifiOff className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{device.name}</h3>
                  <p className="text-gray-400 text-sm capitalize">{device.type.replace('-', ' ')}</p>
                  <p className="text-gray-400 text-sm">{device.location}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  Last ping: {Math.floor((Date.now() - device.lastPing.getTime()) / 1000)}s ago
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">System Settings</h2>
      
      <div className="grid gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Parking Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-400">Maximum Parking Duration (hours)</label>
              <input type="number" defaultValue="24" className="bg-gray-700 text-white px-3 py-2 rounded-lg w-20" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-400">Hourly Rate ($)</label>
              <input type="number" defaultValue="5.00" step="0.25" className="bg-gray-700 text-white px-3 py-2 rounded-lg w-20" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-400">Grace Period (minutes)</label>
              <input type="number" defaultValue="15" className="bg-gray-700 text-white px-3 py-2 rounded-lg w-20" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">RFID Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-400">Auto-block on insufficient balance</label>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-400">Minimum balance warning ($)</label>
              <input type="number" defaultValue="10.00" step="0.25" className="bg-gray-700 text-white px-3 py-2 rounded-lg w-20" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">System Actions</h3>
          <div className="flex space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Export Data
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors">
              System Backup
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              Reset System
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SmartPark RFID</h1>
              <p className="text-gray-400 text-sm">IoT Parking Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">{currentTime.toLocaleTimeString()}</p>
              <p className="text-gray-400 text-sm">{currentTime.toLocaleDateString()}</p>
            </div>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-4">
          <div className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'parking' && renderParkingGrid()}
          {activeTab === 'rfid' && renderRFIDCards()}
          {activeTab === 'devices' && renderIoTDevices()}
          {activeTab === 'settings' && renderSettings()}
        </main>
      </div>
    </div>
  );
}

export default App;