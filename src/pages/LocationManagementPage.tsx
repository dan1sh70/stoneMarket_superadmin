import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  RefreshCw,
  Search,
  Building,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const LocationManagementPage: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedState, setExpandedState] = useState<string | null>(null);

  // Modals state
  const [showStateModal, setShowStateModal] = useState(false);
  const [newStateName, setNewStateName] = useState('');

  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [targetStateId, setTargetStateId] = useState<string | null>(null);
  const [newDistrictName, setNewDistrictName] = useState('');
  const [newAreaName, setNewAreaName] = useState('');
  const [newPincode, setNewPincode] = useState('');

  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadLocations = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminService.getLocations();
      const list = Array.isArray(res) ? res : [];
      setLocations(list);
      if (list.length > 0 && !expandedState) {
        setExpandedState(list[0]._id);
      }
    } catch (err) {
      console.error('Failed to load locations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleCreateState = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await superAdminService.createState({ name: newStateName });
      setActionMessage('State location added to MongoDB.');
      setShowStateModal(false);
      setNewStateName('');
      loadLocations();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create state.');
    }
  };

  const handleAddDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStateId) return;
    try {
      await superAdminService.addDistrictToState(targetStateId, {
        districtName: newDistrictName,
        areaName: newAreaName || undefined,
        pincode: newPincode || undefined
      });
      setActionMessage('District / Mining cluster added to state.');
      setShowDistrictModal(false);
      setNewDistrictName('');
      setNewAreaName('');
      setNewPincode('');
      loadLocations();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to add district.');
    }
  };

  const handleDeleteState = async (stateId: string) => {
    if (!window.confirm('Delete this state territory and all its districts?')) return;
    try {
      await superAdminService.deleteState(stateId);
      setActionMessage('State location removed.');
      loadLocations();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Delete failed.');
    }
  };

  const filteredLocations = locations.filter((st) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const stateMatch = st.name?.toLowerCase().includes(term);
    const districtMatch = st.districts?.some((d: any) => d.name?.toLowerCase().includes(term));
    return stateMatch || districtMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Location Management</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Geographic stone hubs, states, mining belts, and district industrial clusters in MongoDB
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStateModal(true)}
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add State</span>
          </button>
          <button
            onClick={loadLocations}
            className="p-1.5 border border-surface-border bg-white rounded-lg text-slate-600 hover:text-primary transition-all"
            title="Refresh from DB"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-surface-border shadow-card flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search state, district, or industrial cluster..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-surface-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* State & District Accordion / Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white p-12 rounded-2xl border border-surface-border text-center text-slate-400 text-xs">
            Loading geographic master records from database...
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-surface-border text-center text-slate-400 text-xs">
            No geographic locations found in database.
          </div>
        ) : (
          filteredLocations.map((st) => {
            const isExpanded = expandedState === st._id;
            const districtCount = st.districts?.length || 0;

            return (
              <div
                key={st._id}
                className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden"
              >
                {/* State Header Card */}
                <div
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
                  onClick={() => setExpandedState(isExpanded ? null : st._id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-blue-50 text-primary rounded-xl">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">{st.name}</h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {districtCount} Industrial Districts & Mining Belts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTargetStateId(st._id);
                        setShowDistrictModal(true);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add District</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteState(st._id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                      title="Delete State"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Districts Expandable Grid */}
                {isExpanded && (
                  <div className="p-5 border-t border-surface-border bg-slate-50/50">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Registered Districts & Production Areas
                    </h4>
                    {districtCount === 0 ? (
                      <p className="text-xs text-slate-400">No districts added yet for {st.name}.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {st.districts.map((d: any) => (
                          <div
                            key={d._id || d.name}
                            className="bg-white p-3.5 rounded-xl border border-surface-border shadow-sm flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-text-primary">{d.name}</span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                  {d.areas?.length || 0} Areas
                                </span>
                              </div>
                              {d.areas && d.areas.length > 0 && (
                                <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                                  {d.areas.map((a: any, idx: number) => (
                                    <p key={idx} className="truncate">
                                      • {a.name} {a.pincode ? `(${a.pincode})` : ''}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add State Modal */}
      {showStateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-surface-border">
            <h3 className="text-base font-bold text-text-primary mb-1">Add State Territory</h3>
            <p className="text-xs text-text-secondary mb-4">Add a new state location to MongoDB</p>
            <form onSubmit={handleCreateState} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">State Name</label>
                <input
                  type="text"
                  required
                  value={newStateName}
                  onChange={(e) => setNewStateName(e.target.value)}
                  placeholder="e.g. Madhya Pradesh"
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStateModal(false)}
                  className="px-4 py-2 border border-surface-border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold"
                >
                  Save State
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add District Modal */}
      {showDistrictModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-surface-border">
            <h3 className="text-base font-bold text-text-primary mb-1">Add District / Hub</h3>
            <p className="text-xs text-text-secondary mb-4">Add a district to the selected state in MongoDB</p>
            <form onSubmit={handleAddDistrict} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">District Name</label>
                <input
                  type="text"
                  required
                  value={newDistrictName}
                  onChange={(e) => setNewDistrictName(e.target.value)}
                  placeholder="e.g. Katni"
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Primary Area / Cluster</label>
                <input
                  type="text"
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  placeholder="e.g. Industrial Area Phase 1"
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Pincode</label>
                <input
                  type="text"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  placeholder="e.g. 483501"
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDistrictModal(false)}
                  className="px-4 py-2 border border-surface-border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold"
                >
                  Add District
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
