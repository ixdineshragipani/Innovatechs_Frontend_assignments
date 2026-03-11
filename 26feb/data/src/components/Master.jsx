import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Save, Loader2, CheckCircle, XCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { getAllConfigs, updateConfig } from "../api/index";
import dubaiEmblem from "../assets/dubai-emblem.png";
import dubaiSkyline from "../assets/dubai-skyline.jpg";
import configuration from "../components/Configuration";

const DOCUMENT_META = {
  aadhar_card: { label: "Aadhar Card" },
  pan_card:    { label: "PAN Card" },
  tenth_memo:  { label: "10th Memo" },
  twelth_memo: { label: "12th Memo" },
};

const DEFAULT_DOCS = {
  aadhar_card: false,
  pan_card:    false,
  tenth_memo:  false,
  twelth_memo: false,
};

const Master = () => {
  const [configs, setConfigs]         = useState({});
  const [appTypes, setAppTypes]       = useState([]);   // ✅ loaded from DB
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(null);
  const [message, setMessage]         = useState(null);
  const [activeTab, setActiveTab]     = useState(null);
  const navigate = useNavigate();

  // ── Fetch all configs from backend on mount ──────────────
  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await getAllConfigs();

      const mapped = {};
      const types  = [];

      res.data.forEach(cfg => {
        types.push(cfg.applicationType);
        mapped[cfg.applicationType] = {
          aadhar_card: cfg.documents?.aadhar_card?.display ?? false,
          pan_card:    cfg.documents?.pan_card?.display    ?? false,
          tenth_memo:  cfg.documents?.tenth_memo?.display  ?? false,
          twelth_memo: cfg.documents?.twelth_memo?.display ?? false,
        };
      });

      setConfigs(mapped);
      setAppTypes(types);

      // Set first tab as active
      if (types.length > 0) {
        setActiveTab(types[0]);
      }

    } catch (err) {
      console.error("fetchConfigs error:", err);
      showMessage("error", "Failed to load configurations.");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // ── Toggle a document field ON/OFF ───────────────────────
  const handleToggle = (applicationType, docField) => {
    setConfigs(prev => ({
      ...prev,
      [applicationType]: {
        ...prev[applicationType],
        [docField]: !prev[applicationType][docField],
      },
    }));
  };

  // ── Save config to MongoDB ───────────────────────────────
  const handleSave = async (applicationType) => {
    setSaving(applicationType);
    setMessage(null);
    try {
      const boolConfig = configs[applicationType];
      const documents  = {};
      Object.keys(boolConfig).forEach(field => {
        documents[field] = { display: boolConfig[field] };
      });
      await updateConfig(applicationType, documents);
      showMessage("success", `Config saved for ${applicationType.replace("APPLY_", "").replace(/_/g, " ")}`);
    } catch (err) {
      showMessage("error", "Failed to save. Try again.");
    } finally {
      setSaving(null);
    }
  };

  // ── Safe current config ──────────────────────────────────
  const currentConfig = activeTab
    ? (configs[activeTab] ?? { ...DEFAULT_DOCS })
    : { ...DEFAULT_DOCS };

  const enabledCount = Object.values(currentConfig).filter(Boolean).length;

  // ── Loading screen ───────────────────────────────────────
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dubaiSkyline})` }} />
        <div className="fixed inset-0 bg-gradient-to-br from-[#152240]/55 via-[#152240]/50 to-[#152240]/55" />
        <div className="relative z-10 flex items-center gap-3 text-[#FFBF00] text-lg font-semibold">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading configurations...
        </div>
      </div>
    );
  }

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
                <p className="text-[#FFBF00]/50 text-xs tracking-widest uppercase">Documents Configuration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* ✅ Navigate to Configuration page to add new types */}
              <button
                onClick={() => navigate("/configuration")}
                className="flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-[#FFBF00]/30 text-[#FFBF00] font-semibold rounded-xl px-5 py-2.5 hover:bg-[#FFBF00]/20 transition-all duration-300"
              >
               Manage Types
              </button>
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
        <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">

          <div>
            <h2 className="text-2xl font-bold text-[#FFBF00]">Document Configuration</h2>
            <p className="text-[#FFBF00]/60 text-sm mt-1">
              Manage which documents users must upload for each application type. Toggle to show or hide upload fields.
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
                ? <CheckCircle className="w-4 h-4" />
                : <XCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          {/* Dropdown — dynamically loaded from DB */}
          {appTypes.length === 0 ? (
            <div className="text-[#FFBF00]/50 text-sm">
              No application types found.{" "}
              <button
                onClick={() => navigate("/configuration")}
                className="underline text-[#FFBF00]"
              >
                Add one here
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <label className="text-[#FFBF00]/60 text-sm font-medium">
                Select Application Type
              </label>
              <div className="relative w-full max-w-sm">
                <select
                  value={activeTab ?? ""}
                  onChange={e => setActiveTab(e.target.value)}
                  className="w-full bg-white/10 border border-[#FFBF00]/30 text-[#FFBF00] rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#FFBF00]/70 focus:bg-white/15 appearance-none cursor-pointer transition-all"
                >
                  <option value="" disabled className="bg-[#152240]">
                    -- Select Application Type --
                  </option>
                  {appTypes.map(type => (
                    <option key={type} value={type} className="bg-[#152240] text-[#FFBF00]">
                      {type.replace("APPLY_", "").replace(/_/g, " ")}
                    </option>
                  ))}
                </select>

                {/* Chevron icon */}
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFBF00]/50 pointer-events-none"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
          {/* Info row */}
          {activeTab && (
            <p className="text-[#FFBF00]/80 text-sm">
              Configuring:{" "}
              <span className="text-[#FFBF00] font-semibold">
                {activeTab.replace("APPLY_", "").replace(/_/g, " ").toLowerCase()}
              </span>
              <span className="ml-3 text-[#FFBF00]/40">
                ({enabledCount} / {Object.keys(DOCUMENT_META).length} enabled)
              </span>
            </p>
          )}

          {/* Document toggles */}
          {activeTab && (
            <div className="backdrop-blur-xl bg-white/10 border border-[#FFBF00]/20 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#FFBF00]/10">
                <h3 className="text-[#FFBF00] text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#FFBF00]/70" />
                  Document Fields
                </h3>
              </div>

              <div className="p-6 space-y-3">
                {Object.entries(DOCUMENT_META).map(([field, meta]) => {
                  const isEnabled = currentConfig[field] ?? false;
                  return (
                    <div
                      key={field}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                        isEnabled
                          ? "bg-[#FFBF00]/5 border-[#FFBF00]/30"
                          : "bg-white/5 border-[#FFBF00]/10"
                      }`}
                    >
                      <span className="text-[#FFBF00] font-medium">{meta.label}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                          isEnabled
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/10 text-[#FFBF00]/40"
                        }`}>
                          {isEnabled ? "VISIBLE" : "HIDDEN"}
                        </span>
                        <button
                          onClick={() => handleToggle(activeTab, field)}
                          className="transition-colors hover:scale-110"
                        >
                          {isEnabled
                            ? <ToggleRight className="w-8 h-8 text-emerald-400" />
                            : <ToggleLeft  className="w-8 h-8 text-[#FFBF00]/30" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Save button */}
          {activeTab && (
            <button
              onClick={() => handleSave(activeTab)}
              disabled={saving === activeTab}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FFBF00] to-yellow-500 text-[#152240] font-semibold rounded-xl h-12 px-8 hover:from-[#FFBF00] hover:to-[#FFBF00] transition-all duration-300 shadow-lg shadow-[#FFBF00]/20 hover:shadow-[#FFBF00]/40 disabled:opacity-50"
            >
              {saving === activeTab ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Configurations</>
              )}
            </button>
          )}

          {/* Summary table */}
          {/* {appTypes.length > 0 && (
            <div className="backdrop-blur-xl bg-white/10 border border-[#FFBF00]/20 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#FFBF00]/10">
                <h3 className="text-[#FFBF00] text-lg font-semibold">📊 All Configurations Summary</h3>
              </div>
              <div className="p-6 space-y-4">
                {appTypes.map(type => (
                  <div key={type}>
                    <p className="text-[#FFBF00]/80 text-sm font-semibold mb-2">
                      {type.replace("APPLY_", "").replace(/_/g, " ")}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(DOCUMENT_META).map(([field, meta]) => {
                        const enabled = configs[type]?.[field] ?? false;
                        return (
                          <span
                            key={field}
                            className={`text-xs px-3 py-1 rounded-full font-semibold ${
                              enabled
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/10 text-[#FFBF00]/30 border border-[#FFBF00]/10"
                            }`}
                          >
                            {meta.label}: {enabled ? "✓" : "✗"}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}

        </main>
      </div>
    </div>
  );
};

export default Master;