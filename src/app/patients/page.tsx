'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Patient } from '@/types';
import { formatDateDisplay } from '@/lib/currency';

export default function PatientsDirectory() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // New patient modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/patients');
      const json = await res.json();
      if (json.success) {
        setPatients(json.data);
      }
    } catch (err) {
      console.error('Error fetching patients', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, gender, contact, address })
      });
      const json = await res.json();
      if (json.success) {
        setPatients([...patients, json.data]);
        setShowModal(false);
        setName(''); setAge(''); setContact(''); setAddress('');
      } else {
        alert(json.error || 'Failed to save patient');
      }
    } catch (err) {
      alert('Failed saving patient');
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">Patient Directory</h1>
          <p className="text-xs text-slate-500">Master database of registered patients for instant billing</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-[#0b3d66] hover:bg-[#124d7e] text-white font-extrabold text-xs rounded-xl shadow-md transition hover:-translate-y-0.5 inline-flex items-center gap-1.5 self-start md:self-auto"
        >
          + Add New Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm max-w-md">
        <input
          type="text"
          placeholder="Search by patient name, ID, mobile number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Loading patients directory...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">No patient records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#0b3d66] text-white font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Patient ID</th>
                  <th className="py-3 px-4 text-left">Full Name</th>
                  <th className="py-3 px-4 text-left">Age / Gender</th>
                  <th className="py-3 px-4 text-left">Contact No.</th>
                  <th className="py-3 px-4 text-left">Address</th>
                  <th className="py-3 px-4 text-left">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold mono text-[#0b3d66]">{p.patId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.age ? `${p.age} yrs` : '-'} / {p.gender}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{p.contact || '-'}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{p.address || '-'}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDateDisplay(p.createdAt?.split('T')[0] || '')}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/invoices/new?patId=${p.patId}`}
                        className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 rounded transition inline-block"
                      >
                        + Create Bill
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h2 className="font-extrabold text-slate-900 text-sm font-sans">Add Patient Record</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Age</label>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 65"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Contact Mobile No.</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Residential Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  placeholder="Full address"
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
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
