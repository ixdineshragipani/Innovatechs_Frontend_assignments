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
      <div>
        <div>
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
      <div className='flex fixed bg-red-200 w-full h-[60px] p-2 justify-between border-2'>
        <img className='flex h-[40px] w-[50px]' src='https://images.seeklogo.com/logo-png/54/1/government-of-dubai-logo-png_seeklogo-547455.png'/>
         <h1 className='flex justify-center text-4xl'>Documents Configuration</h1>
        <div className=' pb-[25px] border-2 h-[20px] w-[60px] hover:bg-red-500 rounded-lg'>
          <button onClick={logout} className='pb-3 pl-0.5'>Logout</button></div>
      </div>
      <div className='pt-[60px] bg-gradient-to-br from-red-200 to-blue-200 h-screen'>
       
      
      <p className='p-3'>
        Manage which documents users must upload for each application type.
        Toggle the checkboxes to show or hide upload fields for users and click on Save Configurations to save.
      </p>

      {message && (
        <div className={`p-3 alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      
        <div className='flex gap-3 p-3'>
          Select Document: {APPLICATION_TYPES.map(type => (
          <button
            key={type}
            className={`p-2 hover:bg-gray-500  border border-black rounded-lg tab ${activeTab === type ? 'active' : ''}`}
            onClick={() => setActiveTab(type)}
          > {type.replace('APPLY_', '')}
          </button>
        ))}
         </div>

         <div className="flex gap-3 p-3">You are making configurations of <div className="text-blue-600">"{activeTab.replace('APPLY_'," ").toLowerCase()} "</div></div>
     

      <div className='p-3'>
        {/* <div >
          <span className="ml-auto">
            {Object.values(currentConfig).filter(Boolean).length} / {Object.keys(DOCUMENT_META).length} enabled
          </span>
        </div> */}
        

        <div className="mb-[2px] p-3">
          Toggle the switch ON to make the document field visible to users. Toggle OFF to hide it.
        </div>

        <div className='flex bg-gray-500 rounded-[10px] justify-between p-3'>
          {Object.entries(DOCUMENT_META).map(([field, meta]) => {
            const isEnabled = currentConfig[field] ?? false;
            return (
              <div key={field} className={`checkbox-row ${isEnabled ? 'enabled' : ''}`}>
                <span >
                  <span>{meta.icon}</span>
                  {meta.label}
                </span>
                <div className='flex'>
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

        <div className='text-[10px] pt-2 w-[90px]'>
          <button
            className="btn btn-primary h-[30px] w-[150px] hover:bg-gray-600 border-2 border-black rounded-lg"
            onClick={() => handleSave(activeTab)}
            disabled={saving === activeTab}
          >
            {saving === activeTab ? 'Saving...' : ' Save Configurations'}
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
                    {meta.icon} {meta.label}: {enabled ? 'Yes' : 'No'}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div> */}
      </div>
    </div>
  );
}
