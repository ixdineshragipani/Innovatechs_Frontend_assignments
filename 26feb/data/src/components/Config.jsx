import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfigByType, uploadDocuments } from '../api/index';

const APPLICATION_TYPES = ['APPLY_PASSPORT', 'APPLY_DRIVING_LICENCE', 'APPLY_NOC'];

const DOCUMENT_META = {
  aadhar_card: { label: 'Aadhar Card', accept: '.jpg,.jpeg,.png,.pdf' },
  pan_card:    { label: 'PAN Card', accept: '.jpg,.jpeg,.png,.pdf' },
  tenth_memo:  { label: '10th Memo', accept: '.jpg,.jpeg,.png,.pdf' },
  twelth_memo: { label: '12th Memo',  accept: '.jpg,.jpeg,.png,.pdf' },
};

export default function UserPage() {
  const [selectedType, setSelectedType] = useState('');
  const [userName, setUserName] = useState('');
  const [config, setConfig] = useState(null);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate=useNavigate();
  
  useEffect(() => {
    if (!selectedType) { setConfig(null); return; }
    setLoading(true);
    setFiles({});
    setMessage(null);
    getConfigByType(selectedType)
      .then(res => setConfig(res.data.documents))
      .catch(() => setMessage({ type: 'error', text: 'Failed to fetch configuration.' }))
      .finally(() => setLoading(false));
  }, [selectedType]);

  const handleFileChange = (field, file) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const enabledFields = config
    ? Object.entries(config).filter(([, val]) => val?.display)
    : [];

  const handleSubmit = async () => {
    if (!userName.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name.' });
      return;
    }
    if (!selectedType) {
      setMessage({ type: 'error', text: 'Please select an application type.' });
      return;
    }
    if (enabledFields.length === 0) {
      setMessage({ type: 'error', text: 'No documents required. Contact admin.' });
      return;
    }
    

    const missingFields = enabledFields
      .filter(([field]) => !files[field])
      .map(([field]) => DOCUMENT_META[field].label);

    if (missingFields.length > 0) {
      setMessage({ type: 'error', text: `Please upload: ${missingFields.join(', ')}` });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('userName', userName.trim());
      formData.append('applicationType', selectedType);
      enabledFields.forEach(([field]) => {
        if (files[field]) formData.append(field, files[field]);
      });

      await uploadDocuments(formData);
      setMessage({ type: 'success', text: 'Documents submitted successfully!' });
      setFiles({});
      setUserName('');
      setSelectedType('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setSubmitting(false);
    }
  };
const logout=()=>{
  navigate("/");
}
  return (
    <div>
      <div className='flex fixed p-2 w-full bg-red-100 justify-between'>
        <p></p>
        <h1 className='text-2xl' >User Portal</h1>
        <button className='p-1 hover:bg-red-500 rounded-lg border-2 border-black' onClick={logout}>Logout</button>
      </div>
      
    <div className='flex p-5 pt-[80px] bg-gradient-to-br from-red-200 to-blue-100 h-screen flex-col gap-2'>
      <div>
        <div>Step 1: Application Details</div>

        <div className='flex gap-2'>
          <label>Full Name</label>
          <input
            type="text"
            className='pl-3 rounded-full'
            placeholder="  Enter your full name"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </div>

        <div>
          <label >Application Type</label>
          <select
            value={selectedType}
            className='pl-3 rounded-full'
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="">-- Select Application Type --</option>
            {APPLICATION_TYPES.map(type => (
              <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedType && (
        <div>
          <div>
            Step 2: Upload Required Documents 
            {config && (
              <span className="app-type-badge pl-2 text-blue-600">
                 {enabledFields.length} document{enabledFields.length !== 1 ? 's' : ''} required
              </span>
            )}
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner" />
              Fetching requirements...
            </div>
          )}

          {!loading && enabledFields.length === 0 && config && (
            <div className="font-red-500 ">
              <p>No documents are currently required for <strong>{selectedType}</strong>.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#94a3b8' }}>
                Please contact the administrator.
              </p>
            </div>
          )}

          {!loading && enabledFields.length > 0 && (
            <>
              <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
                The following documents are required for <strong>{selectedType.replace(/_/g, ' ')}</strong>.
                All fields are mandatory.
              </div>

              <div className="doc-grid">
                {enabledFields.map(([field]) => {
                  const meta = DOCUMENT_META[field];
                  const file = files[field];
                  return (
                    <div key={field} className={`upload-field ${file ? 'has-file' : ''}`}>
                      <label className="upload-label" htmlFor={`file-${field}`}>
                        <span className="upload-icon">{meta.icon}</span>
                        <strong style={{ fontSize: '0.9rem' }}>{meta.label}</strong>
                        {file ? (
                          <span className="file-name"> {file.name}</span>
                        ) : (
                          <span className="upload-text">
                            <strong>Click to upload</strong> or drag & drop
                            <br />JPG, PNG or PDF (max 5MB)
                          </span>
                        )}
                      </label>
                      <input
                        id={`file-${field}`}
                        type="file"
                        accept={meta.accept}
                        onChange={e => handleFileChange(field, e.target.files[0])}
                      />
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                {Object.keys(files).length} of {enabledFields.length} files selected
              </div>

              <button
                className="btn btn-success p-2 hover:bg-red-300 rounded-lg"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Documents'}
              </button>
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

