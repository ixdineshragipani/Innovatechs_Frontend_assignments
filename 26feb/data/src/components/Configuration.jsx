import { useState, useEffect } from 'react';
import { getAllConfigs, createType, deleteType } from '../api/index';
import { useNavigate } from 'react-router-dom';

const DEFAULT_TYPES = ["APPLY_PASSPORT", "APPLY_DRIVING_LICENCE", "APPLY_NOC"];

export default function Configuration() {
  const [types, setTypes]           = useState([]);
  const [newType, setNewType]       = useState("");
  const [loading, setLoading]       = useState(true);
  const [creating, setCreating]     = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage]       = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await getAllConfigs();
      setTypes(res.data);
    } catch (err) {
      showMessage("error", "Failed to load application types.");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreate = async () => {
    if (!newType.trim()) {
      showMessage("error", "Please enter an application type name.");
      return;
    }
    setCreating(true);
    try {
      const res = await createType(newType.trim());
      showMessage("success", res.message);
      setNewType("");
      fetchTypes();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create type.";
      showMessage("error", msg);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (applicationType) => {
    if (!window.confirm(`Delete "${applicationType}"? This cannot be undone.`)) return;
    setDeletingId(applicationType);
    try {
      const res = await deleteType(applicationType);
      showMessage("success", res.message);
      fetchTypes();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete.";
      showMessage("error", msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCreate();
  };

  const logout = () => navigate("/");

  return (
    <div>
      {/* Navbar — same style as Master.jsx */}
      <div className='flex fixed bg-red-200 w-full h-[60px] p-2 justify-between border-2 z-10'>
        <img
          className='flex h-[40px] w-[50px]'
          src='https://images.seeklogo.com/logo-png/54/1/government-of-dubai-logo-png_seeklogo-547455.png'
        />
        <h1 className='flex justify-center text-4xl'>Application Type Configuration</h1>
        <div className='pb-[25px] border-2 h-[20px] w-[60px] hover:bg-red-500 rounded-lg'>
          <button onClick={logout} className='pb-3 pl-0.5'>Logout</button>
        </div>
      </div>

      {/* Page content */}
      <div className='pt-[60px] bg-gradient-to-br from-red-200 to-blue-200 min-h-screen'>

        <p className='p-3 text-gray-700'>
          Add new application types here. They will appear as tabs in Master Configuration
          and as options in the User page dropdown.
        </p>

        {/* Message */}
        {message && (
          <div className={`mx-3 mb-3 p-3 rounded-lg font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </div>
        )}

        {/* Add New Type Card */}
        <div className='mx-3 mb-4 bg-white rounded-xl p-4 shadow border border-gray-200'>
          <h2 className='text-lg font-semibold text-blue-900 mb-1'>➕ Add New Application Type</h2>
          <p className='text-sm text-gray-500 mb-3'>
            Type a name like <strong>Birth Certificate</strong> — it will be saved as{' '}
            <strong>APPLY_BIRTH_CERTIFICATE</strong> automatically.
          </p>

          {/* Input row */}
          <div className='flex gap-3'>
            <input
              type='text'
              placeholder='e.g. Birth Certificate or APPLY_BIRTH_CERTIFICATE'
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              onKeyDown={handleKeyDown}
              className='flex-1 p-2 border border-gray-400 rounded-lg outline-none text-sm'
            />
            <button
              onClick={handleCreate}
              disabled={creating}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg border border-blue-800 disabled:opacity-50'
            >
              {creating ? 'Adding...' : '➕ Add'}
            </button>
          </div>

          {/* Live preview of formatted name */}
          {newType.trim() && (
            <p className='mt-2 text-sm text-gray-500'>
              Will be saved as:{' '}
              <strong className='text-blue-600'>
                {newType.trim().toUpperCase().replace(/\s+/g, '_')}
              </strong>
            </p>
          )}
        </div>

        {/* All Types List Card */}
        <div className='mx-3 bg-white rounded-xl p-4 shadow border border-gray-200'>
          <h2 className='text-lg font-semibold text-blue-900 mb-3'>
            📋 All Application Types{' '}
            <span className='text-sm bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full ml-1'>
              {types.length}
            </span>
          </h2>

          {loading ? (
            <div className='text-center py-8 text-gray-400'>Loading...</div>
          ) : types.length === 0 ? (
            <div className='text-center py-8 text-gray-400'>No types found.</div>
          ) : (
            <div className='flex flex-col gap-3'>
              {types.map((config) => {
                const isDefault    = DEFAULT_TYPES.includes(config.applicationType);
                const enabledCount = Object.values(config.documents || {})
                  .filter(d => d?.display).length;

                return (
                  <div
                    key={config._id}
                    className='flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50 flex-wrap gap-2'
                  >
                    {/* Left — name + meta */}
                    <div>
                      <div className='font-semibold text-blue-900 text-sm'>
                        {isDefault ? '🔒' : '📝'} {config.applicationType}
                      </div>
                      <div className='flex items-center gap-2 mt-1'>
                        <span className='text-xs text-gray-500'>
                          {enabledCount} doc{enabledCount !== 1 ? 's' : ''} enabled
                        </span>
                        {isDefault && (
                          <span className='text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full'>
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right — doc chips + delete */}
                    <div className='flex items-center gap-2 flex-wrap'>

                      {/* Document status chips */}
                      <div className='flex gap-1 flex-wrap'>
                        {Object.entries(config.documents || {}).map(([field, val]) => (
                          <span
                            key={field}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              val?.display
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {field.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>

                      {/* Delete — only for non-default */}
                      {!isDefault && (
                        <button
                          onClick={() => handleDelete(config.applicationType)}
                          disabled={deletingId === config.applicationType}
                          className='px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-lg text-xs font-semibold disabled:opacity-50'
                        >
                          {deletingId === config.applicationType ? 'Deleting...' : '🗑️ Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Back button */}
        <div className='p-3'>
          <button
            onClick={() => navigate('/master')}
            className='px-4 py-2 hover:bg-gray-500 border border-black rounded-lg text-sm font-medium'
          >
             Back to Master
          </button>
        </div>

        <br /><br /><br />
      </div>
    </div>
  );
}