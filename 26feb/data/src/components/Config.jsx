import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfigByType, uploadDocuments, getAllTypes } from '../api/index';
import { Upload, FileText, CheckCircle, XCircle, Loader2, ChevronDown } from 'lucide-react';
import dubaiEmblem from '../assets/dubai-emblem.png';
import dubaiSkyline from '../assets/dubai-skyline.jpg';

const DOCUMENT_META = {
  aadhar_card: { label: 'Aadhar Card', accept: '.jpg,.jpeg,.png,.pdf' },
  pan_card:    { label: 'PAN Card',    accept: '.jpg,.jpeg,.png,.pdf' },
  tenth_memo:  { label: '10th Memo',   accept: '.jpg,.jpeg,.png,.pdf' },
  twelth_memo: { label: '12th Memo',   accept: '.jpg,.jpeg,.png,.pdf' },
};

export default function Config() {
  const [applicationTypes, setApplicationTypes] = useState([]);
  const [selectedType, setSelectedType]         = useState('');
  const [userName, setUserName]                 = useState('');
  const [config, setConfig]                     = useState(null);
  const [files, setFiles]                       = useState({});
  const [loading, setLoading]                   = useState(false);
  const [loadingTypes, setLoadingTypes]         = useState(true);
  const [submitting, setSubmitting]             = useState(false);
  const [message, setMessage]                   = useState(null);

  const navigate = useNavigate();

  // ── Load all application types from DB ───────────────────
  useEffect(() => {
    getAllTypes()
      .then(res => setApplicationTypes(res.data))
      .catch(() => setApplicationTypes([
        'APPLY_PASSPORT',
        'APPLY_DRIVING_LICENCE',
        'APPLY_NOC',
      ]))
      .finally(() => setLoadingTypes(false));
  }, []);

  // ── Fetch master config when type changes ────────────────
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

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleFileChange = (field, file) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const enabledFields = config
    ? Object.entries(config).filter(([, val]) => val?.display)
    : [];

  // Submit documents 
  const handleSubmit = async () => {
    if (!userName.trim()) {
      showMessage('error', 'Please enter your full name.');
      return;
    }
    if (!selectedType) {
      showMessage('error', 'Please select an application type.');
      return;
    }
    if (enabledFields.length === 0) {
      showMessage('error', 'No documents required. Contact administrator.');
      return;
    }

    const missingFields = enabledFields
      .filter(([field]) => !files[field])
      .map(([field]) => DOCUMENT_META[field].label);

    if (missingFields.length > 0) {
      showMessage('error', `Please upload: ${missingFields.join(', ')}`);
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
      showMessage('success', 'Documents submitted successfully!');
      setFiles({});
      setUserName('');
      setSelectedType('');
      setConfig(null);
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Upload failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${dubaiSkyline})` }} />
      <div className="fixed inset-0 bg-gradient-to-br from-[#152240]/55 via-[#152240]/50 to-[#152240]/55" />
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent z-20" />
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent z-20" />

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header */}
        <header className="backdrop-blur-xl bg-white/5 border-b border-[#FFBF00]/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={dubaiEmblem} alt="Dubai Emblem" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-lg font-bold text-[#FFBF00] tracking-wide">Government of Dubai</h1>
                <p className="text-[#FFBF00]/80 text-xs tracking-widest uppercase">Document Submission Portal</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FFBF00] to-yellow-200 text-[#152240] font-semibold rounded-xl px-5 py-2.5 hover:from-[#FFBF00] hover:to-[#FFBF00] transition-all duration-300 shadow-lg shadow-[#FFBF00]/20"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6">

          <div>
            <h2 className="text-2xl font-bold text-[#FFBF00]">User Portal</h2>
            <p className="text-[#FFBF00]/60 text-sm mt-1">
              Select your application type and upload the required documents.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 border ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {message.type === 'success'
                ? <CheckCircle className="w-4 h-4 shrink-0" />
                : <XCircle    className="w-4 h-4 shrink-0" />}
              {message.text}
            </div>
          )}

          {/* Step 1 — Application Details */}
          <div className="backdrop-blur-xl bg-white/10 border border-[#FFBF00]/20 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#FFBF00]/10">
              <h3 className="text-[#FFBF00] text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FFBF00]/70" />
                Step 1: Application Details
              </h3>
            </div>

            <div className="p-6 space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-[#FFBF00]/70 text-sm font-medium mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full bg-white/10 border border-[#FFBF00]/20 text-[#FFBF00] placeholder-[#FFBF00]/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FFBF00]/60 focus:bg-white/15 transition-all"
                />
              </div>

              {/* Application Type Dropdown */}
              <div>
                <label className="block text-[#FFBF00]/70 text-sm font-medium mb-1">
                  Application Type <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                    className="w-full bg-white/10 border border-[#FFBF00]/20 text-[#FFBF00] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FFBF00]/60 appearance-none cursor-pointer transition-all"
                  >
                    <option value="" className="bg-[#152240]">-- Select Application Type --</option>
                    {loadingTypes ? (
                      <option disabled className="bg-[#152240]">Loading...</option>
                    ) : (
                      applicationTypes.map(type => (
                        <option key={type} value={type} className="bg-[#152240]">
                          {type.replace(/_/g, ' ')}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFBF00]/50 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

          {/* Step 2 — Upload Documents */}
          {selectedType && (
            <div className="backdrop-blur-xl bg-white/10 border border-[#FFBF00]/20 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#FFBF00]/10 flex items-center justify-between">
                <h3 className="text-[#FFBF00] text-lg font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#FFBF00]/70" />
                  Step 2: Upload Required Documents
                </h3>
                {config && (
                  <span className="text-xs bg-[#FFBF00]/10 border border-[#FFBF00]/30 text-[#FFBF00]/70 px-3 py-1 rounded-full font-medium">
                    {enabledFields.length} doc{enabledFields.length !== 1 ? 's' : ''} required
                  </span>
                )}
              </div>

              <div className="p-6">

                {/* Loading */}
                {loading && (
                  <div className="flex items-center justify-center gap-2 py-8 text-[#FFBF00]/50">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Fetching requirements...
                  </div>
                )}

                {/* No docs required */}
                {!loading && enabledFields.length === 0 && config && (
                  <div className="text-center py-8">
                    <p className="text-[#FFBF00]/60 text-sm">
                      No documents are currently required for <strong className="text-[#FFBF00]">{selectedType.replace(/_/g, ' ')}</strong>.
                    </p>
                    <p className="text-[#FFBF00]/30 text-xs mt-1">Please contact the administrator.</p>
                  </div>
                )}

                {/* Upload fields */}
                {!loading && enabledFields.length > 0 && (
                  <div className="space-y-4">

                    <p className="text-[#FFBF00]/60 text-sm">
                      The following documents are required for{' '}
                      <strong className="text-[#FFBF00]">{selectedType.replace(/_/g, ' ')}</strong>.
                      All fields are mandatory.
                    </p>

                    {/* File upload cards */}
                    {enabledFields.map(([field]) => {
                      const meta = DOCUMENT_META[field];
                      const file = files[field];
                      return (
                        <div
                          key={field}
                          className={`border rounded-xl p-4 transition-all duration-300 ${
                            file
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-white/5 border-[#FFBF00]/20 hover:border-[#FFBF00]/40 hover:bg-white/10'
                          }`}
                        >
                          <label
                            htmlFor={`file-${field}`}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            {/* Left — label */}
                            <div>
                              <p className="text-[#FFBF00] font-semibold text-sm">
                                {meta.label}
                                <span className="text-red-400 ml-1">*</span>
                              </p>
                              {file ? (
                                <p className="text-emerald-400 text-xs mt-0.5 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> {file.name}
                                </p>
                              ) : (
                                <p className="text-[#FFBF00]/30 text-xs mt-0.5">
                                  JPG, PNG or PDF — max 5MB
                                </p>
                              )}
                            </div>

                            {/* Right — upload button */}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                              file
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-[#FFBF00]/10 text-[#FFBF00] border border-[#FFBF00]/30 hover:bg-[#FFBF00]/20'
                            }`}>
                              <Upload className="w-3.5 h-3.5" />
                              {file ? 'Change' : 'Upload'}
                            </div>
                          </label>

                          <input
                            id={`file-${field}`}
                            type="file"
                            accept={meta.accept}
                            className="hidden"
                            onChange={e => handleFileChange(field, e.target.files[0])}
                          />
                        </div>
                      );
                    })}

                    {/* Progress */}
                    <p className="text-[#FFBF00]/40 text-xs">
                      {Object.keys(files).length} of {enabledFields.length} files uploaded
                    </p>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFBF00] to-yellow-500 text-[#152240] font-semibold rounded-xl h-12 px-8 hover:from-[#FFBF00] hover:to-[#FFBF00] transition-all duration-300 shadow-lg shadow-[#FFBF00]/20 hover:shadow-[#FFBF00]/40 disabled:opacity-50 mt-2"
                    >
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                      ) : (
                        <><Upload className="w-4 h-4" /> Submit Documents</>
                      )}
                    </button>

                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}