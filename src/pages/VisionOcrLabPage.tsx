import React, { useState } from 'react';
import {
  Scan,
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Layers,
  Calculator,
  Search,
  ExternalLink,
  Save,
  Check,
  RefreshCw,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Image as ImageIcon,
  Palette,
  MapPin,
  Tag
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const VisionOcrLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stone_matcher' | 'estimate_parser'>('stone_matcher');

  // --- MODEL A: STONE MATCHER STATE ---
  const [stoneFile, setStoneFile] = useState<File | null>(null);
  const [stonePreview, setStonePreview] = useState<string | null>(null);
  const [isMatchingStone, setIsMatchingStone] = useState(false);
  const [stoneMatchResult, setStoneMatchResult] = useState<any>(null);
  const [stoneError, setStoneError] = useState<string | null>(null);

  // --- MODEL B: ESTIMATE OCR STATE ---
  const [estimateFile, setEstimateFile] = useState<File | null>(null);
  const [estimatePreview, setEstimatePreview] = useState<string | null>(null);
  const [estimateTypeMode, setEstimateTypeMode] = useState<'auto' | 'slab' | 'particular'>('auto');
  const [isParsingEstimate, setIsParsingEstimate] = useState(false);
  const [parsedEstimate, setParsedEstimate] = useState<any>(null);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [isSavingEstimate, setIsSavingEstimate] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // --- HANDLERS FOR MODEL A ---
  const handleSelectStoneImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStoneFile(file);
      setStonePreview(URL.createObjectURL(file));
      setStoneMatchResult(null);
      setStoneError(null);
    }
  };

  const handleRunStoneMatch = async () => {
    if (!stoneFile) {
      alert('Please upload an image of natural stone, granite or marble.');
      return;
    }
    setIsMatchingStone(true);
    setStoneError(null);
    try {
      const formData = new FormData();
      formData.append('image', stoneFile);
      const data = await superAdminService.matchStoneImage(formData);
      setStoneMatchResult(data);
    } catch (err: any) {
      console.error('Stone matcher error:', err);
      setStoneError(err?.response?.data?.message || 'Failed to analyze stone image.');
    } finally {
      setIsMatchingStone(false);
    }
  };

  // --- HANDLERS FOR MODEL B ---
  const handleSelectEstimateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEstimateFile(file);
      setEstimatePreview(URL.createObjectURL(file));
      setParsedEstimate(null);
      setEstimateError(null);
      setSaveSuccessMsg(null);
    }
  };

  const handleRunEstimateOCR = async () => {
    if (!estimateFile) {
      alert('Please upload a photo of a measurement slip, handwritten ledger, or quotation slip.');
      return;
    }
    setIsParsingEstimate(true);
    setEstimateError(null);
    setSaveSuccessMsg(null);
    try {
      const formData = new FormData();
      formData.append('image', estimateFile);
      formData.append('estimateType', estimateTypeMode);
      const data = await superAdminService.parseEstimateImage(formData);
      setParsedEstimate(data);
    } catch (err: any) {
      console.error('Estimate OCR error:', err);
      setEstimateError(err?.response?.data?.message || 'Failed to process document slip.');
    } finally {
      setIsParsingEstimate(false);
    }
  };

  const handleSaveToLedger = async () => {
    if (!parsedEstimate) return;
    setIsSavingEstimate(true);
    try {
      await superAdminService.saveParsedEstimate(parsedEstimate);
      setSaveSuccessMsg('Estimate successfully saved into the MongoDB Estimate Ledger as Draft!');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save estimate to database.');
    } finally {
      setIsSavingEstimate(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Vision OCR & AI Processing Hub</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Gemini 2.5 Vision</span>
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time visual stone recognition for exact/nearby matches and automated OCR extraction for slab & particular estimates
          </p>
        </div>
      </div>

      {/* Model Tabs */}
      <div className="flex border-b border-surface-border space-x-6">
        <button
          onClick={() => setActiveTab('stone_matcher')}
          className={`pb-3 text-xs font-bold transition-all relative flex items-center space-x-2 ${
            activeTab === 'stone_matcher'
              ? 'text-primary border-b-2 border-primary'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Model A: Stone Similarity & Nearby Matcher</span>
        </button>

        <button
          onClick={() => setActiveTab('estimate_parser')}
          className={`pb-3 text-xs font-bold transition-all relative flex items-center space-x-2 ${
            activeTab === 'estimate_parser'
              ? 'text-primary border-b-2 border-primary'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Model B: Measurement Slip & Estimate OCR</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MODEL A - STONE RECOGNITION & NEARBY MATCHER */}
      {/* ======================================================== */}
      {activeTab === 'stone_matcher' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Upload & Trigger */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-text-primary flex items-center space-x-2">
                <Camera className="w-4 h-4 text-primary" />
                <span>Upload Stone Sample</span>
              </h3>
              <p className="text-xs text-slate-500">
                Upload a quarry block, cut slab, or tile texture photograph. The vision engine detects stone type, color tones, mineral veins, and searches the platform database for exact and nearby matches.
              </p>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-slate-200 hover:border-primary rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/40 relative overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelectStoneImage}
                  className="hidden"
                />
                {stonePreview ? (
                  <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-inner">
                    <img
                      src={stonePreview}
                      alt="Stone preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                      Click to choose another photo
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-primary flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">Click to upload stone photo</p>
                      <p className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  </div>
                )}
              </label>

              {stoneError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{stoneError}</span>
                </div>
              )}

              <button
                onClick={handleRunStoneMatch}
                disabled={!stoneFile || isMatchingStone}
                className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isMatchingStone ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Texture & Scanning Database...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Identify Stone & Find Matches</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: AI Analysis & Matched Products */}
          <div className="lg:col-span-7 space-y-4">
            {!stoneMatchResult ? (
              <div className="bg-white rounded-2xl border border-surface-border p-12 shadow-card text-center text-slate-400 space-y-3">
                <Palette className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No Analysis Generated Yet</h4>
                <p className="text-xs max-w-md mx-auto">
                  Upload an image on the left and click "Identify Stone" to view mineral classifications, commercial varieties, and matching supplier products in MongoDB.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* Visual Analysis Badge Card */}
                <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-text-primary flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Vision Model Insights</span>
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      High Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Stone Family</p>
                      <p className="font-bold text-slate-800 mt-0.5">{stoneMatchResult.visual_analysis?.stone_type || 'Natural Stone'}</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Primary Color</p>
                      <p className="font-bold text-slate-800 mt-0.5">{stoneMatchResult.visual_analysis?.primary_color || 'Multi-color'}</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Texture Pattern</p>
                      <p className="font-bold text-slate-800 mt-0.5">{stoneMatchResult.visual_analysis?.texture_pattern || 'Grained'}</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Surface Finish</p>
                      <p className="font-bold text-slate-800 mt-0.5">{stoneMatchResult.visual_analysis?.finish || 'Polished'}</p>
                    </div>
                  </div>

                  {stoneMatchResult.visual_analysis?.commercial_names && (
                    <div className="pt-2">
                      <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Identified Commercial Varieties:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {stoneMatchResult.visual_analysis.commercial_names.map((name: string, i: number) => (
                          <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-primary border border-blue-100">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Database Matched Products Grid */}
                <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-text-primary">
                      Exact & Nearby Matches in Database ({stoneMatchResult.matches?.length || 0})
                    </h3>
                    <span className="text-xs text-slate-400">Ranked by Texture & Color Similarity</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {stoneMatchResult.matches?.map((match: any, index: number) => (
                      <div
                        key={match._id || index}
                        className="p-3.5 rounded-xl border border-surface-border hover:border-primary/50 transition-all bg-slate-50/50 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              match.similarity_score >= 90
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {match.similarity_score}% Match • {match.match_type}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{match.name}</h4>
                            <p className="text-[11px] text-slate-500">{match.category || 'Natural Stone Slab'}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 text-slate-600">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{match.location}</span>
                          </span>
                          <span className="font-semibold text-primary">
                            {match.supplier}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MODEL B - ESTIMATE DOCUMENT & MEASUREMENT OCR */}
      {/* ======================================================== */}
      {activeTab === 'estimate_parser' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Document Upload */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-text-primary flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                <span>Upload Measurement Slip / Slip Photo</span>
              </h3>
              <p className="text-xs text-slate-500">
                Upload a handwritten challan, cutting measurement diary, or printed quotation. The OCR engine reads rows, lengths, widths, calculates areas automatically, and prepares ledger line items.
              </p>

              {/* Estimation Mode Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">Expected Slip Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'auto', label: 'Auto Detect' },
                    { id: 'slab', label: 'Slab Cut Slip' },
                    { id: 'particular', label: 'Particulars' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setEstimateTypeMode(mode.id as any)}
                      className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all ${
                        estimateTypeMode === mode.id
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-surface-border hover:bg-slate-100'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-slate-200 hover:border-primary rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/40 relative overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelectEstimateImage}
                  className="hidden"
                />
                {estimatePreview ? (
                  <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-inner">
                    <img
                      src={estimatePreview}
                      alt="Estimate preview"
                      className="w-full h-full object-contain bg-slate-900/5"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                      Click to choose another slip
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">Click to upload challan or slip</p>
                      <p className="text-[11px] text-slate-400">Handwritten or printed photo (PNG, JPG)</p>
                    </div>
                  </div>
                )}
              </label>

              {estimateError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{estimateError}</span>
                </div>
              )}

              <button
                onClick={handleRunEstimateOCR}
                disabled={!estimateFile || isParsingEstimate}
                className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isParsingEstimate ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Measurement Columns & Calculating...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Extract Measurements & Generate Estimate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Extracted Table & Calculations */}
          <div className="lg:col-span-7 space-y-4">
            {!parsedEstimate ? (
              <div className="bg-white rounded-2xl border border-surface-border p-12 shadow-card text-center text-slate-400 space-y-3">
                <Calculator className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No Slip Parsed Yet</h4>
                <p className="text-xs max-w-md mx-auto">
                  Upload a photo of a stone measurement slip on the left to extract serial numbers, dimensions, units, calculate areas mathematically, and save directly to MongoDB.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {saveSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                {/* SLAB ESTIMATION EXTRACTED VIEW */}
                {parsedEstimate.type === 'slab' && (
                  <div className="bg-white rounded-2xl border border-surface-border shadow-card p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-text-primary">
                            Slab Measurement Breakdown
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase">
                            Unit: {parsedEstimate.measurement_unit} ➔ {parsedEstimate.area_unit}
                          </span>
                        </div>
                        {parsedEstimate.customer_name && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Customer / Party: <strong>{parsedEstimate.customer_name}</strong>
                          </p>
                        )}
                      </div>

                      <button
                        onClick={handleSaveToLedger}
                        disabled={isSavingEstimate}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingEstimate ? 'Saving...' : 'Save into Estimates'}</span>
                      </button>
                    </div>

                    {/* Summary KPI Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-[10px] uppercase font-semibold text-slate-400">Total Slabs</span>
                        <p className="text-base font-bold text-slate-900 mt-0.5">{parsedEstimate.total_rows} Pieces</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-[10px] uppercase font-semibold text-slate-400">Total Area</span>
                        <p className="text-base font-bold text-blue-600 mt-0.5">{parsedEstimate.total_area} {parsedEstimate.area_unit}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-[10px] uppercase font-semibold text-slate-400">Est. Amount</span>
                        <p className="text-base font-bold text-emerald-600 mt-0.5">₹{parsedEstimate.total_amount?.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Extracted Rows Table */}
                    <div className="border border-surface-border rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 border-b border-surface-border text-[11px] font-semibold text-slate-500">
                          <tr>
                            <th className="py-2 px-3">#</th>
                            <th className="py-2 px-3">Length ({parsedEstimate.measurement_unit})</th>
                            <th className="py-2 px-3">Width ({parsedEstimate.measurement_unit})</th>
                            <th className="py-2 px-3 text-right">Area ({parsedEstimate.area_unit})</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border font-mono">
                          {parsedEstimate.rows?.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 text-slate-400 font-sans">{row.serial_number}</td>
                              <td className="py-2 px-3 text-slate-800 font-medium">{row.length}</td>
                              <td className="py-2 px-3 text-slate-800 font-medium">{row.width}</td>
                              <td className="py-2 px-3 text-right font-bold text-blue-700">{row.calculated_area}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* PARTICULAR ESTIMATION EXTRACTED VIEW */}
                {parsedEstimate.type === 'particular' && (
                  <div className="bg-white rounded-2xl border border-surface-border shadow-card p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
                      <div>
                        <span className="text-xs font-bold text-text-primary">
                          Particular Items & Charges Breakdown
                        </span>
                        {parsedEstimate.customer_name && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Customer / Party: <strong>{parsedEstimate.customer_name}</strong>
                          </p>
                        )}
                      </div>

                      <button
                        onClick={handleSaveToLedger}
                        disabled={isSavingEstimate}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingEstimate ? 'Saving...' : 'Save into Estimates'}</span>
                      </button>
                    </div>

                    {/* Summary KPI */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-[10px] uppercase font-semibold text-slate-400">Total Items</span>
                        <p className="text-base font-bold text-slate-900 mt-0.5">{parsedEstimate.total_items} Items</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-[10px] uppercase font-semibold text-slate-400">Total Subtotal</span>
                        <p className="text-base font-bold text-emerald-600 mt-0.5">₹{parsedEstimate.subtotal?.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="border border-surface-border rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 border-b border-surface-border text-[11px] font-semibold text-slate-500">
                          <tr>
                            <th className="py-2 px-3">#</th>
                            <th className="py-2 px-3">Particular Name</th>
                            <th className="py-2 px-3">Quantity</th>
                            <th className="py-2 px-3">Rate</th>
                            <th className="py-2 px-3 text-right">Item Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border">
                          {parsedEstimate.items?.map((item: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 text-slate-400">{item.serial_number}</td>
                              <td className="py-2 px-3 font-semibold text-slate-900">{item.particular_name}</td>
                              <td className="py-2 px-3 text-slate-600">{item.quantity} {item.unit}</td>
                              <td className="py-2 px-3 text-slate-600">₹{item.unit_price}</td>
                              <td className="py-2 px-3 text-right font-bold text-emerald-700">₹{item.item_total?.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
