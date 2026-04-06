'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { BadgeIndianRupee, CheckCheck, Clock3, Loader2, LogOut, Search, ShieldCheck, UserRoundCog, Wrench } from 'lucide-react';

import { adminHeaders, fetchJson } from '@/lib/api';

type ServiceRecord = {
  id: number;
  customer_name: string;
  customer_phone?: string | null;
  vehicle_brand?: string | null;
  plate_number: string;
  car_model: string;
  service_type: string;
  amount: number;
  payment_mode?: string | null;
  status?: string | null;
  service_location?: string | null;
  notes?: string | null;
  assigned_to?: string | null;
  check_in_time?: string | null;
};

type DashboardPayload = {
  summary: {
    daily_turnover: number;
    monthly_turnover: number;
    total_tasks: number;
    active_tasks: number;
    doorstep_tasks: number;
  };
  recent_tasks: ServiceRecord[];
};

const defaultForm = {
  customerName: '',
  customerPhone: '',
  vehicleBrand: '',
  carModel: '',
  plateNumber: '',
  serviceType: 'Ceramic Coating',
  amount: '',
  paymentMode: 'Cash',
  serviceLocation: 'In-Shop',
  notes: '',
  assignedTo: '',
};

const statuses = ['Pending', 'In Progress', 'Completed', 'Delivered'] as const;

type Props = {
  token: string;
  onLogout: () => void;
};

export default function AdminPortal({ token, onLogout }: Props) {
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (search?: string) => {
    const [dashboardData, serviceData] = await Promise.all([
      fetchJson<DashboardPayload>('/api/legends/dashboard', {
        headers: adminHeaders(token),
      }),
      fetchJson<ServiceRecord[]>(
        search && search.trim().length >= 2
          ? `/api/legends/services?q=${encodeURIComponent(search.trim())}`
          : '/api/legends/services?limit=40',
        {
          headers: adminHeaders(token),
        }
      ),
    ]);
    setDashboard(dashboardData);
    setServices(serviceData);
  }, [token]);

  useEffect(() => {
    load()
      .catch((err) => setError(err instanceof Error ? err.message : 'Admin failed to load'))
      .finally(() => setLoading(false));
  }, [load]);

  const grouped = useMemo(
    () =>
      statuses.map((status) => ({
        status,
        items: services.filter((service) => service.status === status),
      })),
    [services]
  );

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await fetchJson('/api/legends/services', {
        method: 'POST',
        headers: adminHeaders(token),
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });
      setForm(defaultForm);
      await load(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      await fetchJson(`/api/legends/services/${id}`, {
        method: 'PATCH',
        headers: adminHeaders(token),
        body: JSON.stringify({ status }),
      });
      await load(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  const handleSearch = async () => {
    try {
      await load(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-black/40 p-10 text-center text-zinc-300">
        <Loader2 className="mx-auto mb-4 animate-spin text-[#FFD700]" />
        Loading Legends Admin...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-4">
        {[
          ['Today Revenue', `₹ ${Number(dashboard?.summary.daily_turnover ?? 0).toLocaleString('en-IN')}`, <BadgeIndianRupee key="money" className="text-zinc-400" />],
          ['Monthly Revenue', `₹ ${Number(dashboard?.summary.monthly_turnover ?? 0).toLocaleString('en-IN')}`, <ShieldCheck key="shield" className="text-zinc-400" />],
          ['Active Tasks', String(dashboard?.summary.active_tasks ?? 0), <Wrench key="wrench" className="text-zinc-400" />],
          ['Doorstep Tasks', String(dashboard?.summary.doorstep_tasks ?? 0), <UserRoundCog key="user" className="text-zinc-400" />],
        ].map(([label, value, icon]) => (
          <div key={String(label)} className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</div>
              {icon}
            </div>
            <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
          </div>
        ))}
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-300 transition-all hover:border-red-400/40 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleCreate} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <div className="mb-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Admin Intake</div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Client & Car Details</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Enter customer and vehicle information to create a new task.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['customerName', 'Customer Name'],
              ['customerPhone', 'Phone'],
              ['vehicleBrand', 'Brand'],
              ['carModel', 'Car Model'],
              ['plateNumber', 'Plate Number'],
              ['assignedTo', 'Assigned To'],
            ].map(([key, label]) => (
              <input
                key={key}
                value={form[key as keyof typeof form]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                placeholder={label}
                className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />
            ))}

            <select
              value={form.serviceType}
              onChange={(event) => setForm((current) => ({ ...current, serviceType: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            >
              <option>Paint Protection Film</option>
              <option>Ceramic Coating</option>
              <option>Graphene Coating</option>
              <option>Glass Coating</option>
              <option>Leather Coating</option>
              <option>Washing</option>
              <option>Rubbing & Dry Clean</option>
            </select>

            <input
              value={form.amount}
              onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
              type="number"
              placeholder="Amount"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
            />

            <select
              value={form.paymentMode}
              onChange={(event) => setForm((current) => ({ ...current, paymentMode: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            >
              <option value="Cash">Cash</option>
              <option value="Online / UPI">Online / UPI</option>
            </select>

            <select
              value={form.serviceLocation}
              onChange={(event) => setForm((current) => ({ ...current, serviceLocation: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            >
              <option value="In-Shop">In-Shop</option>
              <option value="Doorstep">Doorstep</option>
            </select>

            <textarea
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Notes, finish promise, client requests, upsell notes"
              className="min-h-28 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 md:col-span-2"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-zinc-200"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <CheckCheck className="h-4 w-4" />}
            Save Task
          </button>
        </form>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Workflow Board</div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Task updates</h2>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      void handleSearch();
                    }
                  }}
                  placeholder="Search client, plate..."
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-10 py-3 text-sm text-white outline-none focus:border-zinc-600 md:w-72"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            {grouped.map((group) => (
              <div key={group.status} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">{group.status}</div>
                    <div className="mt-1 text-2xl font-bold text-white">{group.items.length}</div>
                  </div>
                  <Clock3 className="h-4 w-4 text-zinc-700" />
                </div>
                <div className="space-y-3">
                  {group.items.length > 0 ? (
                    group.items.map((service) => (
                      <div key={service.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-white">{service.plate_number}</div>
                        <div className="mt-1 text-[10px] text-zinc-500">
                          {service.customer_name} · {service.car_model}
                        </div>
                        <div className="mt-3 text-xs text-zinc-400">{service.service_type}</div>
                        <div className="mt-2 text-sm font-bold text-white">₹ {service.amount}</div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {statuses
                            .filter((status) => status !== service.status)
                            .slice(0, 2)
                            .map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => void handleStatus(service.id, status)}
                                className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-300 transition-all hover:border-zinc-500 hover:text-white"
                              >
                                {status}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-zinc-800 py-10 text-center text-[10px] uppercase tracking-widest text-zinc-700">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-8">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">System Logs</div>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-zinc-400">
          Every admin submission on this page is securely stored in the local SQLite database (<span className="font-mono text-zinc-300">backend/magic_engine.db</span>). 
          The infrastructure is ready for scale with multi-admin support via PostgreSQL if needed.
        </p>
      </section>
    </div>
  );
}
