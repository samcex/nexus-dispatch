import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  ClipboardList, 
  Truck, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  MoreVertical,
  Navigation,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---
const INITIAL_DISPATCHES = [
  { id: 'DS-4902', destination: 'Central Park North', status: 'In Progress', priority: 'High', driver: 'Alex R.', time: '12:45 PM' },
  { id: 'DS-4903', destination: 'Wall Street 12', status: 'Pending', priority: 'Medium', driver: 'Sarah L.', time: '1:15 PM' },
  { id: 'DS-4904', destination: 'Brooklyn Bridge', status: 'Completed', priority: 'Low', driver: 'Mike K.', time: '11:30 AM' },
];

const VEHICLES = [
  { id: 'V-101', name: 'Rapid Unit 01', status: 'Online', battery: '88%' },
  { id: 'V-102', name: 'Heavy Duty 04', status: 'Busy', battery: '45%' },
  { id: 'V-103', name: 'E-Transit 09', status: 'Online', battery: '92%' },
];

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'map', icon: MapIcon, label: 'Live Map' },
    { id: 'dispatches', icon: ClipboardList, label: 'Dispatches' },
    { id: 'vehicles', icon: Truck, label: 'Fleet' },
    { id: 'drivers', icon: Users, label: 'Drivers' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="sidebar glass">
      <div className="brand">
        <div className="brand-logo" />
        <h1 className="brand-name">NEXUS DISPATCH</h1>
      </div>
      <div className="nav-group">
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Header = () => (
  <header className="header glass">
    <div className="search-bar glass">
      <Search size={18} className="text-secondary" />
      <input 
        type="text" 
        placeholder="Search dispatches, vehicles, or drivers..." 
        style={{ background: 'none', border: 'none', color: 'white', outline: 'none', width: '100%' }}
      />
    </div>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <Bell size={20} className="text-secondary" style={{ cursor: 'pointer' }} />
        <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#334155' }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Ops Center</span>
      </div>
    </div>
  </header>
);

const StatCard = ({ label, value, icon: Icon, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="stat-card glass"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{label}</span>
      <Icon size={18} className="text-secondary" />
    </div>
    <div className="stat-value">{value}</div>
    {trend && (
      <div style={{ fontSize: '0.75rem', color: trend.startsWith('+') ? 'var(--success-color)' : 'var(--danger-color)', marginTop: '0.5rem' }}>
        {trend} from yesterday
      </div>
    )}
  </motion.div>
);

const DispatchCard = ({ dispatch, onStatusChange }) => {
  const statuses = ['Pending', 'In Progress', 'Completed'];
  
  const cycleStatus = () => {
    const currentIndex = statuses.indexOf(dispatch.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onStatusChange(dispatch.id, nextStatus);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass"
      style={{ padding: '1rem', borderRadius: '12px', borderLeft: `4px solid ${dispatch.priority === 'High' ? 'var(--danger-color)' : 'var(--accent-color)'}` }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{dispatch.id}</span>
        <span 
          onClick={cycleStatus}
          style={{ 
            fontSize: '0.7rem', 
            padding: '2px 8px', 
            borderRadius: '10px', 
            background: dispatch.status === 'In Progress' ? 'rgba(59, 130, 246, 0.2)' : dispatch.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
            color: dispatch.status === 'In Progress' ? 'var(--accent-color)' : dispatch.status === 'Completed' ? 'var(--success-color)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {dispatch.status}
        </span>
      </div>
      <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>{dispatch.destination}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <Navigation size={12} />
          <span>{dispatch.driver}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <Clock size={12} />
          <span>{dispatch.time}</span>
        </div>
      </div>
    </motion.div>
  );
};

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// ... (INITIAL_DISPATCHES and VEHICLES stay the same)

// ... (Sidebar and Header stay the same)

const RealMap = () => {
  const [positions, setPositions] = useState(
    DRIVERS.filter(d => d.status === 'On Duty').map((d, i) => ({
      ...d,
      lat: 40.7128 + (i * 0.02),
      lng: -74.0060 - (i * 0.02)
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(p => ({
        ...p,
        lat: p.lat + (Math.random() - 0.5) * 0.001,
        lng: p.lng + (Math.random() - 0.5) * 0.001,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="map-widget glass" style={{ padding: 0 }}>
      <MapContainer 
        center={[40.7484, -73.9857]} 
        zoom={12} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <div style={{ color: 'black', minWidth: '120px' }}>
                <strong style={{ fontSize: '1rem' }}>{p.name}</strong><br />
                <span style={{ color: 'var(--text-secondary)' }}>Unit: {p.vehicle}</span><br />
                <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>● {p.status}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', zIndex: 1000 }}>
        <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem' }}>
          Live Units: 4
        </div>
        <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem' }}>
          Region: New York
        </div>
      </div>
    </div>
  );
};

const CreateDispatchModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({ destination: '', priority: 'Medium', driver: 'Auto Assign' });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchAddress = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Geocoding error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.destination) searchAddress(formData.destination);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.destination]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass" 
        style={{ padding: '2rem', borderRadius: '24px', width: '450px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>New Dispatch</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Destination Address</label>
            <input 
              className="glass" 
              style={{ padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--surface-border)', color: 'white', width: '100%' }}
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value})}
              placeholder="Search real address..."
            />
            {suggestions.length > 0 && (
              <div className="glass" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '5px', borderRadius: '12px', overflow: 'hidden' }}>
                {suggestions.map((s, idx) => (
                  <div 
                    key={idx} 
                    className="nav-item" 
                    style={{ padding: '0.75rem', fontSize: '0.8rem', borderBottom: idx < suggestions.length - 1 ? '1px solid var(--surface-border)' : 'none' }}
                    onClick={() => {
                      setFormData({...formData, destination: s.display_name});
                      setSuggestions([]);
                    }}
                  >
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Priority</label>
              <select 
                className="glass" 
                style={{ padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--surface-border)', color: 'white', background: 'var(--surface-color)' }}
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Assign Driver</label>
              <select 
                className="glass" 
                style={{ padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--surface-border)', color: 'white', background: 'var(--surface-color)' }}
                value={formData.driver}
                onChange={e => setFormData({...formData, driver: e.target.value})}
              >
                <option value="Auto Assign">Auto Assign</option>
                {DRIVERS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button 
          disabled={!formData.destination}
          style={{ 
            padding: '1rem', 
            borderRadius: '16px', 
            cursor: formData.destination ? 'pointer' : 'not-allowed', 
            background: formData.destination ? 'var(--accent-color)' : 'var(--surface-border)', 
            color: 'white', 
            border: 'none',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
          onClick={() => { onCreate(formData); onClose(); }}
        >
          Initialize Unit Dispatch
        </button>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dispatches, setDispatches] = useState(() => {
    const saved = localStorage.getItem('nexus_dispatches');
    return saved ? JSON.parse(saved) : INITIAL_DISPATCHES;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('nexus_dispatches', JSON.stringify(dispatches));
  }, [dispatches]);

  const createDispatch = (data) => {
    const newDispatch = {
      id: `DS-${Math.floor(Math.random() * 9000) + 1000}`,
      destination: data.destination,
      status: 'Pending',
      priority: data.priority,
      driver: data.driver === 'Auto Assign' ? 'Awaiting...' : data.driver,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setDispatches([newDispatch, ...dispatches]);
  };

  const handleStatusChange = (id, newStatus) => {
    setDispatches(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const deleteDispatch = (id) => {
    setDispatches(prev => prev.filter(d => d.id !== id));
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <>
            <StatCard label="Active Dispatches" value={dispatches.filter(d => d.status !== 'Completed').length} icon={ClipboardList} trend="+2.4%" />
            <StatCard label="Available Drivers" value={DRIVERS.filter(d => d.status === 'On Duty').length} icon={Users} trend="-1" />
            <StatCard label="Avg. Response Time" value="4.2m" icon={Clock} trend="-0.5m" />
            <StatCard label="Completed Today" value={dispatches.filter(d => d.status === 'Completed').length + 45} icon={CheckCircle2} trend="+12%" />
            <RealMap />
            <div className="dispatch-list glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Active Tasks</h2>
                <button 
                  className="glass" 
                  style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', color: 'white', cursor: 'pointer' }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                <AnimatePresence>
                  {dispatches.map(d => (
                    <DispatchCard key={d.id} dispatch={d} onStatusChange={handleStatusChange} onDelete={deleteDispatch} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </>
        );
      case 'map':
        return <div style={{ gridColumn: 'span 12', height: '80vh' }}><RealMap /></div>;
      case 'dispatches':
        return (
          <div className="glass" style={{ gridColumn: 'span 12', padding: '2rem', borderRadius: '24px' }}>
             <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>All Dispatches</h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                <AnimatePresence>
                  {dispatches.map(d => <DispatchCard key={d.id} dispatch={d} onStatusChange={handleStatusChange} onDelete={deleteDispatch} />)}
                </AnimatePresence>
             </div>
          </div>
        );
      case 'drivers':
        return (
          <div className="glass" style={{ gridColumn: 'span 12', padding: '2rem', borderRadius: '24px' }}>
             <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Active Drivers</h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {DRIVERS.map(d => (
                  <div key={d.id} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={24} className="text-secondary" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{d.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Unit: {d.vehicle}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px', background: d.status === 'On Duty' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: d.status === 'On Duty' ? 'var(--success-color)' : 'var(--warning-color)' }}>
                        {d.status}
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>⭐ {d.rating}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'vehicles':
        return (
          <div className="glass" style={{ gridColumn: 'span 12', padding: '2rem', borderRadius: '24px' }}>
             <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Fleet Status</h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {VEHICLES.map(v => (
                  <div key={v.id} className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 700 }}>{v.id}</span>
                      <div className={`status-indicator status-${v.status.toLowerCase()}`} />
                    </div>
                    <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{v.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Battery: {v.battery}</div>
                  </div>
                ))}
             </div>
          </div>
        );
      default:
        return <div style={{ gridColumn: 'span 12', padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Module under development</div>;
    }
  };

  return (
    <>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      <div className="main-wrapper">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="content-container">
          {renderContent()}
        </main>
      </div>
      <CreateDispatchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={createDispatch} 
      />
    </>
  );
}
