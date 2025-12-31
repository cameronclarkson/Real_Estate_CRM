'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Tag, MessageSquare, Trash2, MapPin, DollarSign, User, Building2, FileText } from 'lucide-react';
import { Card as CardType, Label, Utilities, Contact } from '@/lib/types';
import { useBoard } from '@/context/BoardContext';

interface CardDetailModalProps {
  card: CardType;
  onClose: () => void;
}

const LABEL_COLORS = [
  { color: '#ef4444', name: 'Red' },
  { color: '#f97316', name: 'Orange' },
  { color: '#eab308', name: 'Yellow' },
  { color: '#22c55e', name: 'Green' },
  { color: '#3b82f6', name: 'Blue' },
  { color: '#a855f7', name: 'Purple' },
];

const ZONING_OPTIONS = [
  'Residential',
  'Commercial',
  'Industrial',
  'Agricultural',
  'Mixed Use',
  'Rural',
  'Other',
];

const TOPOGRAPHY_OPTIONS = [
  'Flat',
  'Rolling Hills',
  'Mountainous',
  'Sloped',
  'Wetland',
  'Other',
];

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  const { updateCard, deleteCard, addLabel, removeLabel, addComment } = useBoard();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [commentText, setCommentText] = useState('');
  const [showLabelPicker, setShowLabelPicker] = useState(false);

  // Property Information
  const [address, setAddress] = useState(card.address || '');
  const [parcelNumber, setParcelNumber] = useState(card.parcelNumber || '');
  const [legalDescription, setLegalDescription] = useState(card.legalDescription || '');
  const [acreage, setAcreage] = useState(card.acreage?.toString() || '');
  const [lotDimensions, setLotDimensions] = useState(card.lotDimensions || '');

  // Land Details
  const [zoning, setZoning] = useState(card.zoning || '');
  const [utilities, setUtilities] = useState<Utilities>(card.utilities || {
    water: false,
    sewer: false,
    electric: false,
    gas: false,
  });
  const [accessRoad, setAccessRoad] = useState(card.accessRoad || '');
  const [topography, setTopography] = useState(card.topography || '');
  const [floodZone, setFloodZone] = useState(card.floodZone || '');
  const [surveyInfo, setSurveyInfo] = useState(card.surveyInfo || '');
  const [environmentalConcerns, setEnvironmentalConcerns] = useState(card.environmentalConcerns || '');

  // Financial
  const [askingPrice, setAskingPrice] = useState(card.askingPrice?.toString() || '');
  const [purchasePrice, setPurchasePrice] = useState(card.purchasePrice?.toString() || '');
  const [assignmentFee, setAssignmentFee] = useState(card.assignmentFee?.toString() || '');
  const [closingCosts, setClosingCosts] = useState(card.closingCosts?.toString() || '');

  // Contacts
  const [seller, setSeller] = useState<Contact>(card.seller || {});
  const [buyer, setBuyer] = useState<Contact>(card.buyer || {});
  const [agent, setAgent] = useState<Contact>(card.agent || {});

  // Dates
  const [contractDate, setContractDate] = useState(
    card.contractDate ? card.contractDate.split('T')[0] : ''
  );
  const [closingDate, setClosingDate] = useState(
    card.closingDate ? card.closingDate.split('T')[0] : ''
  );
  const [leadSource, setLeadSource] = useState(card.leadSource || '');

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || '');
    setAddress(card.address || '');
    setParcelNumber(card.parcelNumber || '');
    setLegalDescription(card.legalDescription || '');
    setAcreage(card.acreage?.toString() || '');
    setLotDimensions(card.lotDimensions || '');
    setZoning(card.zoning || '');
    setUtilities(card.utilities || { water: false, sewer: false, electric: false, gas: false });
    setAccessRoad(card.accessRoad || '');
    setTopography(card.topography || '');
    setFloodZone(card.floodZone || '');
    setSurveyInfo(card.surveyInfo || '');
    setEnvironmentalConcerns(card.environmentalConcerns || '');
    setAskingPrice(card.askingPrice?.toString() || '');
    setPurchasePrice(card.purchasePrice?.toString() || '');
    setAssignmentFee(card.assignmentFee?.toString() || '');
    setClosingCosts(card.closingCosts?.toString() || '');
    setSeller(card.seller || {});
    setBuyer(card.buyer || {});
    setAgent(card.agent || {});
    setContractDate(card.contractDate ? card.contractDate.split('T')[0] : '');
    setClosingDate(card.closingDate ? card.closingDate.split('T')[0] : '');
    setLeadSource(card.leadSource || '');
  }, [card]);

  const handleSave = () => {
    const updates: Partial<CardType> = {
      title: title || address || 'Untitled Deal',
      description,
      address: address || undefined,
      parcelNumber: parcelNumber || undefined,
      legalDescription: legalDescription || undefined,
      acreage: acreage ? parseFloat(acreage) : undefined,
      lotDimensions: lotDimensions || undefined,
      zoning: zoning || undefined,
      utilities,
      accessRoad: accessRoad || undefined,
      topography: topography || undefined,
      floodZone: floodZone || undefined,
      surveyInfo: surveyInfo || undefined,
      environmentalConcerns: environmentalConcerns || undefined,
      askingPrice: askingPrice ? parseFloat(askingPrice) : undefined,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      assignmentFee: assignmentFee ? parseFloat(assignmentFee) : undefined,
      closingCosts: closingCosts ? parseFloat(closingCosts) : undefined,
      seller: Object.keys(seller).length > 0 ? seller : undefined,
      buyer: Object.keys(buyer).length > 0 ? buyer : undefined,
      agent: Object.keys(agent).length > 0 ? agent : undefined,
      contractDate: contractDate || undefined,
      closingDate: closingDate || undefined,
      leadSource: leadSource || undefined,
      createdAt: card.createdAt || new Date().toISOString(),
    };

    // Calculate profit margin if we have purchase price and assignment fee
    if (updates.purchasePrice && updates.assignmentFee) {
      updates.profitMargin = ((updates.assignmentFee / updates.purchasePrice) * 100);
    }

    updateCard(card.id, updates);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this deal?')) {
      deleteCard(card.id);
      onClose();
    }
  };

  const handleAddLabel = (color: string, name: string) => {
    const label: Label = {
      id: `label-${Date.now()}`,
      color,
      name,
    };
    addLabel(card.id, label);
    setShowLabelPicker(false);
  };

  const handleRemoveLabel = (labelId: string) => {
    removeLabel(card.id, labelId);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(card.id, commentText.trim());
      setCommentText('');
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const profitMargin = card.purchasePrice && card.assignmentFee
    ? ((card.assignmentFee / card.purchasePrice) * 100).toFixed(1)
    : null;

  const isOverdue = closingDate && new Date(closingDate) < new Date() && !closingDate.includes('T');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4 sticky top-0 bg-white pb-4 border-b">
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                className="text-2xl font-semibold w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 -ml-2"
                placeholder="Deal title"
              />
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X size={24} />
            </button>
          </div>

          {/* Property Information Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Property Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St, City, State ZIP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcel Number
                </label>
                <input
                  type="text"
                  value={parcelNumber}
                  onChange={(e) => setParcelNumber(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acreage
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={acreage}
                  onChange={(e) => setAcreage(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lot Dimensions
                </label>
                <input
                  type="text"
                  value={lotDimensions}
                  onChange={(e) => setLotDimensions(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 200' x 300'"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Legal Description
                </label>
                <textarea
                  value={legalDescription}
                  onChange={(e) => setLegalDescription(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Land Details Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={18} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Land Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zoning
                </label>
                <select
                  value={zoning}
                  onChange={(e) => {
                    setZoning(e.target.value);
                    handleSave();
                  }}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select zoning</option>
                  {ZONING_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topography
                </label>
                <select
                  value={topography}
                  onChange={(e) => {
                    setTopography(e.target.value);
                    handleSave();
                  }}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select topography</option>
                  {TOPOGRAPHY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Flood Zone
                </label>
                <input
                  type="text"
                  value={floodZone}
                  onChange={(e) => setFloodZone(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Zone A, Zone X"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Road
                </label>
                <input
                  type="text"
                  value={accessRoad}
                  onChange={(e) => setAccessRoad(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Paved, Gravel, Dirt"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Utilities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['water', 'sewer', 'electric', 'gas'] as const).map((util) => (
                    <label key={util} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={utilities[util]}
                        onChange={(e) => {
                          setUtilities({ ...utilities, [util]: e.target.checked });
                          handleSave();
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{util}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Survey Info
                </label>
                <input
                  type="text"
                  value={surveyInfo}
                  onChange={(e) => setSurveyInfo(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Survey status or notes"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Environmental Concerns
                </label>
                <textarea
                  value={environmentalConcerns}
                  onChange={(e) => setEnvironmentalConcerns(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  placeholder="Any environmental issues or concerns"
                />
              </div>
            </div>
          </div>

          {/* Financial Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={18} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Financial Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asking Price
                </label>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price
                </label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Fee
                </label>
                <input
                  type="number"
                  value={assignmentFee}
                  onChange={(e) => setAssignmentFee(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Closing Costs
                </label>
                <input
                  type="number"
                  value={closingCosts}
                  onChange={(e) => setClosingCosts(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              {profitMargin && (
                <div className="md:col-span-2">
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm font-medium text-gray-700">
                      Profit Margin: <span className="text-green-600 font-bold">{profitMargin}%</span>
                    </p>
                    {card.purchasePrice && card.assignmentFee && (
                      <p className="text-xs text-gray-600 mt-1">
                        {formatCurrency(card.assignmentFee)} on {formatCurrency(card.purchasePrice)} purchase
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contacts Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <User size={18} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Contacts</h2>
            </div>
            <div className="space-y-4">
              {/* Seller */}
              <div className="border border-gray-200 rounded p-4">
                <h3 className="font-medium text-gray-700 mb-3">Seller</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={seller.name || ''}
                    onChange={(e) => setSeller({ ...seller, name: e.target.value })}
                    onBlur={handleSave}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                  />
                  <input
                    type="tel"
                    value={seller.phone || ''}
                    onChange={(e) => setSeller({ ...seller, phone: e.target.value })}
                    onBlur={handleSave}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone"
                  />
                  <input
                    type="email"
                    value={seller.email || ''}
                    onChange={(e) => setSeller({ ...seller, email: e.target.value })}
                    onBlur={handleSave}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* Buyer */}
              <div className="border border-gray-200 rounded p-4">
                <h3 className="font-medium text-gray-700 mb-3">Buyer</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={buyer.name || ''}
                    onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
                    onBlur={handleSave}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                  />
                  <input
                    type="tel"
                    value={buyer.phone || ''}
                    onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                    onBlur={handleSave}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone"
                  />
                  <input
                    type="email"
                    value={buyer.email || ''}
                    onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
                    onBlur={handleSave}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* Agent */}
              <div className="border border-gray-200 rounded p-4">
                <h3 className="font-medium text-gray-700 mb-3">Agent</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={agent.name || ''}
                    onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                    onBlur={handleSave}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                  />
                  <input
                    type="tel"
                    value={agent.phone || ''}
                    onChange={(e) => setAgent({ ...agent, phone: e.target.value })}
                    onBlur={handleSave}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone"
                  />
                  <input
                    type="email"
                    value={agent.email || ''}
                    onChange={(e) => setAgent({ ...agent, email: e.target.value })}
                    onBlur={handleSave}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deal Timeline Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Deal Timeline</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Date
                </label>
                <input
                  type="date"
                  value={contractDate}
                  onChange={(e) => {
                    setContractDate(e.target.value);
                    updateCard(card.id, {
                      contractDate: e.target.value || undefined,
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Closing Date
                </label>
                <input
                  type="date"
                  value={closingDate}
                  onChange={(e) => {
                    setClosingDate(e.target.value);
                    updateCard(card.id, {
                      closingDate: e.target.value || undefined,
                    });
                  }}
                  className={`w-full px-3 py-2 border rounded ${
                    isOverdue ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {isOverdue && (
                  <p className="text-sm text-red-600 mt-1">Closing date has passed</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead Source
                </label>
                <input
                  type="text"
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Facebook, Referral, Cold Call"
                />
              </div>
            </div>
          </div>

          {/* Labels Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={18} className="text-gray-600" />
              <span className="font-semibold text-gray-700">Labels</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {card.labels.map((label) => (
                <div
                  key={label.id}
                  className="flex items-center gap-1 px-2 py-1 rounded"
                  style={{ backgroundColor: `${label.color}20` }}
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: label.color }}
                  />
                  {label.name && (
                    <span className="text-sm text-gray-700">{label.name}</span>
                  )}
                  <button
                    onClick={() => handleRemoveLabel(label.id)}
                    className="text-gray-500 hover:text-gray-700 ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowLabelPicker(!showLabelPicker)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700"
            >
              {showLabelPicker ? 'Cancel' : 'Add Label'}
            </button>
            {showLabelPicker && (
              <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm font-medium mb-2">Select a color:</p>
                <div className="flex flex-wrap gap-2">
                  {LABEL_COLORS.map(({ color, name }) => (
                    <button
                      key={color}
                      onClick={() => handleAddLabel(color, name)}
                      className="w-8 h-8 rounded hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              placeholder="Add notes or description about this deal..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>

          {/* Comments Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={18} className="text-gray-600" />
              <span className="font-semibold text-gray-700">Comments</span>
            </div>
            <div className="space-y-3 mb-3">
              {card.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 rounded p-3 border border-gray-200"
                >
                  <p className="text-sm text-gray-700">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>

          {/* Actions Section */}
          <div className="border-t pt-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
