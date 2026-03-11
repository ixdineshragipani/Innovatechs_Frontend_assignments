import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllConfigs, createType, deleteType } from "../api/index";
import { Loader2, CheckCircle, XCircle, Trash2, Plus } from "lucide-react";
import dubaiEmblem from "../assets/dubai-emblem.png";
import dubaiSkyline from "../assets/dubai-skyline.jpg";

export default function Configuration() {
  const [types, setTypes]           = useState([]);
  const [newType, setNewType]       = useState("");
  const [loading, setLoading]       = useState(true);
  const [creating, setCreating]     = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage]       = useState(null);

  const navigate = useNavigate();

  // Load all types from DB on mount
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

  // ── Create new type ──────────────────────────────────────
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

  // ── Delete type ──────────────────────────────────────────
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

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${dubaiSkyline})` }} />
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
                <p className="text-[#FFBF00]/50 text-xs tracking-widest uppercase">
                  Application Type Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Back to Master */}
              <button
                onClick={() => navigate("/master")}
                className="flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-[#FFBF00]/30 text-[#FFBF00] font-semibold rounded-xl px-5 py-2.5 hover:bg-[#FFBF00]/10 transition-all duration-300"
              >
                Back to Master
              </button>
              {/* Logout */}
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-gradient-to-r from-[#FFBF00] to-[#FFBF00]/40 text-[#152240] font-semibold rounded-xl px-5 py-2.5 hover:from-[#FFBF00] hover:to-[#FFBF00] transition-all duration-300 shadow-lg shadow-[#FFBF00]/20"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6">

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-[#FFBF00]">Manage Application Types</h2>
            <p className="text-[#FFBF00]/60 text-sm mt-1">
              Add new application types or delete existing ones.
              Changes reflect immediately in Master Config and User Portal.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
              {message.type === "success"
                ? <CheckCircle className="w-4 h-4 shrink-0" />
                : <XCircle    className="w-4 h-4 shrink-0" />}
              {message.text}
            </div>
          )}

          {/* Add New Type Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-[#FFBF00]/20 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#FFBF00]/10">
              <h3 className="text-[#FFBF00] text-lg font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FFBF00]/70" />
                Add New Application Type
              </h3>
              <p className="text-[#FFBF00]/40 text-xs mt-1">
                Type a name like <strong className="text-[#FFBF00]/60">Birth Certificate</strong> — 
                it will be saved as <strong className="text-[#FFBF00]/60">APPLY_BIRTH_CERTIFICATE</strong>
              </p>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g. Birth Certificate"
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-white/10 border border-[#FFBF00]/20 text-[#FFBF00] placeholder-[#FFBF00]/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FFBF00]/60 focus:bg-white/15 transition-all"
                />
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#FFBF00] to-yellow-500 text-[#152240] font-semibold rounded-xl px-6 py-2.5 hover:from-[#FFBF00] hover:to-[#FFBF00] transition-all duration-300 shadow-lg shadow-[#FFBF00]/20 disabled:opacity-50 whitespace-nowrap"
                >
                  {creating
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
                    : <><Plus className="w-4 h-4" /> Add Type</>}
                </button>
              </div>

              {/* Live preview */}
              {newType.trim() && (
                <p className="text-[#FFBF00]/40 text-xs">
                  Will be saved as:{" "}
                  <strong className="text-[#FFBF00]/70">
                    {newType.trim().toUpperCase().startsWith("APPLY_")
                      ? newType.trim().toUpperCase().replace(/\s+/g, "_")
                      : `APPLY_${newType.trim().toUpperCase().replace(/\s+/g, "_")}`}
                  </strong>
                </p>
              )}
            </div>
          </div>

          {/* All Types List */}
          <div className="backdrop-blur-xl bg-white/10 border border-[#FFBF00]/20 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#FFBF00]/10 flex items-center justify-between">
              <h3 className="text-[#FFBF00] text-lg font-semibold">
                All Application Types
              </h3>
              <span className="text-xs bg-[#FFBF00]/10 border border-[#FFBF00]/30 text-[#FFBF00]/70 px-3 py-1 rounded-full font-medium">
                {types.length} total
              </span>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-[#FFBF00]/50">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </div>
              ) : types.length === 0 ? (
                <div className="text-center py-8 text-[#FFBF00]/40 text-sm">
                  No application types found.
                </div>
              ) : (
                <div className="space-y-3">
                  {types.map(config => {
                    const enabledCount = Object.values(config.documents || {})
                      .filter(d => d?.display).length;

                    return (
                      <div
                        key={config._id}
                        className="flex items-center justify-between p-4 rounded-xl border border-[#FFBF00]/15 bg-white/5 hover:bg-white/10 transition-all gap-3 flex-wrap"
                      >
                        {/* Left — name + meta */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[#FFBF00] font-semibold text-sm">
                            {config.applicationType}
                          </span>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[#FFBF00]/40 text-xs">
                              {enabledCount} doc{enabledCount !== 1 ? "s" : ""} enabled
                            </span>
                            {/* Doc chips */}
                            {Object.entries(config.documents || {}).map(([field, val]) => (
                              <span
                                key={field}
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  val?.display
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-white/10 text-[#FFBF00]/30"
                                }`}
                              >
                                {field.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right — Delete button */}
                        <button
                          onClick={() => handleDelete(config.applicationType)}
                          disabled={deletingId === config.applicationType}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          {deletingId === config.applicationType
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting...</>
                            : <><Trash2  className="w-3.5 h-3.5" /> Delete</>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}