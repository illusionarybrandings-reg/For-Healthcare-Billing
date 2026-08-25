'use client';

import React, { useEffect, useState } from 'react';
import { ServiceMaster } from '@/types';
import { formatMoney } from '@/lib/currency';

export default function ServicesMasterPage() {
  const [services, setServices] = useState<ServiceMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add service modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Nursing');
  const [defaultRate, setDefaultRate] = useState<number>(1000);
  const [defaultGst, setDefaultGst] = useState<number>(0);
  const [description, setDescription] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services');
      const json = await res.json();
      if (json.success) {
        setServices(json.data);
      }
    } catch (err) {
      console.error('Error fetching services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, defaultRate, defaultGst, description })
      });
      const json = await res.json();
      if (json.success) {
        setServices([...services, json.data]);
        setShowModal(false);
        setName(''); setDefaultRate(1000); setDefaultGst(0); setDescription('');
      } else {
        alert(json.error || 'Failed to save service');
      }
    } catch (err) {
      alert('Failed saving service');
    }
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">Services & Pricing Master</h1>
          <p className="text-xs text-slate-500">Preset healthcare services, nursing tariffs, equipment rentals, and GST rates</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-[#0b3d66] hover:bg-[#124d7e] text-white font-extrabold text-xs rounded-xl shadow-md transition hover:-translate-y-0.5 inline-flex items-center gap-1.5 self-start md:self-auto"
        >
          + Add New Service Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm max-w-md">
        <input
          type="text"
          placeholder="Search by service name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition"
        />
      </div>

      {/* Grid of Service Cards */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">Loading services catalog...</div>
      ) : filteredServices.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs">No services catalog item found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((svc) => (
            <div key={svc.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    {svc.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    GST: {svc.defaultGst}%
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">{svc.name}</h3>
                {svc.description && (
                  <p className="text-xs text-slate-500 mt-1">{svc.description}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Default Rate</span>
                <span className="text-base font-extrabold text-[#0b3d66] mono">
                  {formatMoney(svc.defaultRate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h2 className="font-extrabold text-slate-900 text-sm font-sans">Add Service Item to Master</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Suction Machine Rental"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-500 outline-none"
                >
                  <option value="Nursing">Nursing Care</option>
                  <option value="Attendant">Patient Attendant</option>
                  <option value="Equipment Rental">Equipment Rental</option>
                  <option value="Diagnostics">Diagnostics & Sleep Study</option>
                  <option value="Doctor Visit">Doctor Visit</option>
                  <option value="Sales">Equipment Sales</option>
                  <option value="General">General Care</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Default Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={defaultRate}
                    onChange={(e) => setDefaultRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-500 outline-none mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Default GST Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="28"
                    step="1"
                    value={defaultGst}
                    onChange={(e) => setDefaultGst(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-500 outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Description / Billing Unit</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Per day 12-hr shift"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0b3d66] text-white font-extrabold rounded-lg hover:bg-[#124d7e]"
                >
                  Save Service Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
