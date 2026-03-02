import { useState, useEffect } from 'react';
import { getAllConfigs, updateConfig } from '../api/index';
import { useNavigate } from 'react-router-dom';
import landingPage from './LandingPage';


const APPLICATION_TYPES = ['APPLY_PASSPORT', 'APPLY_DRIVING_LICENCE', 'APPLY_NOC'];

const DOCUMENT_META = {
  aadhar_card: { label: 'Aadhar Card' },
  pan_card:    { label: 'PAN Card'},
  tenth_memo:  { label: '10th Memo'},
  twelth_memo: { label: '12th Memo' },
};



export default function MasterPage() {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState(APPLICATION_TYPES[0]);

  const navigate=useNavigate();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
  try {
    const res = await getAllConfigs();

    // Initialize all types with defaults first
    const mapped = {};
    APPLICATION_TYPES.forEach(type => {
      mapped[type] = {
        aadhar_card: false,
        pan_card: false,
        tenth_memo: false,
        twelth_memo: false,
      };
    });

    // Overwrite with actual DB values if they exist
    if (res.data && Array.isArray(res.data)) {
      res.data.forEach(cfg => {
        if (cfg && cfg.applicationType) {
          mapped[cfg.applicationType] = {
            aadhar_card: cfg.documents?.aadhar_card?.display ?? false,
            pan_card:    cfg.documents?.pan_card?.display    ?? false,
            tenth_memo:  cfg.documents?.tenth_memo?.display  ?? false,
            twelth_memo: cfg.documents?.twelth_memo?.display ?? false,
          };
        }
      });
    }

    setConfigs(mapped);
  } catch (err) {
    console.error('Config fetch error:', err);
    // Set safe defaults so UI doesn't crash
    const defaults = {};
    APPLICATION_TYPES.forEach(type => {
      defaults[type] = {
        aadhar_card: false,
        pan_card: false,
        tenth_memo: false,
        twelth_memo: false,
      };
    });
    setConfigs(defaults);
    setMessage({ type: 'error', text: 'Failed to load configurations.' });
  } finally {
    setLoading(false);
  }
};

  const handleToggle = (applicationType, docField) => {
    setConfigs(prev => ({
      ...prev,
      [applicationType]: {
        ...prev[applicationType],
        [docField]: !prev[applicationType][docField],
      }
    }));
  };

  const handleSave = async (applicationType) => {
    setSaving(applicationType);
    setMessage(null);
    try {
      const docConfig = configs[applicationType];
      const documents = {};
      Object.keys(docConfig).forEach(field => {
        documents[field] = { display: docConfig[field] };
      });
      await updateConfig(applicationType, documents);
      setMessage({ type: 'success', text: ` Config saved for ${applicationType}` });
    } catch (err) {
      setMessage({ type: 'error', text: ' Failed to save. Try again.' });
    } finally {
      setSaving(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner" />
          Loading configurations...
        </div>
      </div>
    );
  }

const currentConfig = configs[activeTab] ?? {
  aadhar_card: false,
  pan_card: false,
  tenth_memo: false,
  twelth_memo: false,
};
const logout=()=>{
  navigate("/");
}

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <h1>Master Configuration</h1>
      <p>
        Control which documents users must upload for each application type.
        Toggle the checkboxes to show or hide upload fields for users.
      </p>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      <div>
        {APPLICATION_TYPES.map(type => (
          <button
            key={type}
            className={`tab ${activeTab === type ? 'active' : ''}`}
            onClick={() => setActiveTab(type)}
          > {type.replace('APPLY_', '').replace('_', ' ')}
          </button>
        ))}
      </div>

      <div >
        <div >
          <span className="ml-auto">
            {Object.values(currentConfig).filter(Boolean).length} / {Object.keys(DOCUMENT_META).length} enabled
          </span>
        </div>

        <div className="mb-[2px]">
          Toggle the switch ON to make the document field visible to users. Toggle OFF to hide it.
        </div>

        <div >
          {Object.entries(DOCUMENT_META).map(([field, meta]) => {
            const isEnabled = currentConfig[field] ?? false;
            return (
              <div key={field} className={`checkbox-row ${isEnabled ? 'enabled' : ''}`}>
                <span >
                  <span>{meta.icon}</span>
                  {meta.label}
                </span>
                <div >
                  <span className={`status-chip ${isEnabled ? 'on' : 'off'}`}>
                    {isEnabled ? 'ON' : 'OFF'}
                  </span>
                  <label >
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleToggle(activeTab, field)}
                    />
                    <span  />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div >
          <button
            className="btn btn-primary"
            onClick={() => handleSave(activeTab)}
            disabled={saving === activeTab}
          >
            {saving === activeTab ? 'Saving...' : ' Save Configuration'}
          </button>
        </div>
      </div>

      {/* <div className="card">
        <div className="card-title"> All Configurations Summary</div>
        {APPLICATION_TYPES.map(type => (
          <div key={type} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              {Object.entries(DOCUMENT_META).map(([field, meta]) => {
                const enabled = configs[type]?.[field];
                return (
                  <span
                    key={field}
                    className={`status-chip ${enabled ? 'on' : 'off'}`}
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.7rem' }}
                  >
                    {meta.icon} {meta.label}: {enabled ? '✓' : '✗'}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
