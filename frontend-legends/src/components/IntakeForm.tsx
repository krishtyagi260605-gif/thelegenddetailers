'use client';

import { useState } from 'react';
import { CheckCircle2, ClipboardList, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { fetchJson } from '@/lib/api';
import { SHOWCASE_VEHICLES } from '@/lib/site';

const defaultForm = {
  customerName: '',
  customerPhone: '',
  vehicleBrand: '',
  carModel: '',
  plateNumber: '',
  serviceType: 'Washing',
  amount: '',
  paymentMode: 'Cash',
  serviceLocation: 'In-Shop',
  notes: '',
};

export default function IntakeForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const services = [
    { name: 'Washing', price: 'From ₹1,500' },
    { name: 'PPF', price: 'Consult' },
    { name: 'Ceramic Coating', price: 'From ₹12,000' },
    { name: 'Anti Rust Coat', price: 'Consult' },
    { name: 'Detailing', price: 'From ₹8,000' },
    { name: 'Interior Deep Clean', price: 'From ₹4,500' },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await fetchJson('/api/legends/services', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(String(formData.amount)),
        }),
      });
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between bg-zinc-950 p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD700]">
            <ClipboardList className="text-black" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
              Legend-OS <span className="not-italic text-[#FFD700]">Intake Suite</span>
            </h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Client registration · service planning · billing prep
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-black uppercase tracking-widest text-[#FFD700]">
            {new Date().toLocaleDateString('en-IN')}
          </div>
          <div className="text-[10px] font-mono text-zinc-600">BEGOWAL_DETAIL_STUDIO</div>
        </div>
      </div>

      <div className="p-8 md:p-12">
        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  ['customerName', 'Customer Name'],
                  ['customerPhone', 'Phone Number'],
                  ['vehicleBrand', 'Vehicle Brand'],
                ].map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</label>
                    <input
                      type="text"
                      placeholder={`Enter ${label}`}
                      className="w-full rounded-2xl bg-zinc-50 p-4 text-sm font-bold focus:ring-2 focus:ring-[#FFD700]"
                      value={formData[key as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vehicle Model</label>
                  <input
                    type="text"
                    list="legend-vehicle-models"
                    placeholder="e.g. Thar, Scorpio N, Endeavour"
                    className="w-full rounded-2xl bg-zinc-50 p-4 text-sm font-bold focus:ring-2 focus:ring-[#FFD700]"
                    value={formData.carModel}
                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                  />
                  <datalist id="legend-vehicle-models">
                    {SHOWCASE_VEHICLES.map((vehicle) => (
                      <option key={vehicle} value={vehicle} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Registration Number (Plate)
                  </label>
                  <input
                    type="text"
                    placeholder="PB 09 XX 0001"
                    className="w-full rounded-2xl bg-zinc-50 p-4 text-lg font-black tracking-widest placeholder:tracking-normal focus:ring-2 focus:ring-[#FFD700]"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded-2xl bg-zinc-900 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-black"
              >
                Next: Service Details
              </button>
            </motion.div>
          ) : null}

          {step === 2 ? (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Select Service</label>
                <div className="grid gap-2">
                  {services.map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: service.name })}
                      className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                        formData.serviceType === service.name
                          ? 'border-[#FFD700] bg-[#FFD700]/5'
                          : 'border-zinc-100 hover:border-zinc-200'
                      }`}
                    >
                      <span className="text-sm font-bold">{service.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{service.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Amount Charged</label>
                  <input
                    type="number"
                    placeholder="₹ 0.00"
                    className="w-full rounded-2xl bg-zinc-50 p-4 text-sm font-bold focus:ring-2 focus:ring-[#FFD700]"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Payment Mode</label>
                  <select
                    className="w-full appearance-none rounded-2xl bg-zinc-50 p-4 text-sm font-bold focus:ring-2 focus:ring-[#FFD700]"
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Online">Online / UPI</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Service Location</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['In-Shop', 'Doorstep'] as const).map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceLocation: location })}
                      className={`rounded-2xl py-3 text-xs font-black uppercase tracking-widest transition-all ${
                        formData.serviceLocation === location
                          ? 'bg-[#FFD700] text-black'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Notes / Client Requests</label>
                <textarea
                  placeholder="Special requests, detailing priority, pickup promise..."
                  className="min-h-28 w-full rounded-2xl bg-zinc-50 p-4 text-sm font-bold focus:ring-2 focus:ring-[#FFD700]"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-2xl border border-zinc-100 px-6 py-4 text-xs font-bold uppercase text-zinc-400 transition-all hover:bg-zinc-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FFD700] py-4 text-xs font-black uppercase tracking-widest text-black transition-all hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Confirm Intake'}
                </button>
              </div>
            </motion.div>
          ) : null}

          {step === 3 ? (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 py-12 text-center"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-500">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight italic">Intake Successful</h3>
                <p className="text-sm text-zinc-500">
                  Vehicle <strong>{formData.plateNumber}</strong> has been registered in the system.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setFormData(defaultForm);
                  setError(null);
                }}
                className="rounded-xl bg-zinc-900 px-8 py-3 text-xs font-black uppercase tracking-widest text-white"
              >
                New Entry
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
