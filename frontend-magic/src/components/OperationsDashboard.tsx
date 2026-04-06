'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BadgeIndianRupee,
  CarFront,
  CircleAlert,
  Clock3,
  Loader2,
  MapPinned,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';

import { API_BASE_URL, fetchJson, formatCurrency } from '@/lib/api';

type ServiceStatus = 'Pending' | 'In Progress' | 'Completed' | 'Delivered';
type PaymentMode = 'Cash' | 'Online';

type ServiceRecord = {
  id: number;
  customer_name: string;
  customer_phone?: string | null;
  vehicle_brand?: string | null;
  plate_number: string;
  car_model: string;
  service_type: string;
  amount: number;
  payment_mode: PaymentMode | null;
  status: ServiceStatus | null;
  check_in_time: string | null;
  completion_time: string | null;
  notes?: string | null;
  service_location?: string | null;
  assigned_to?: string | null;
};

type DashboardPayload = {
  summary: {
    daily_turnover: number;
    monthly_turnover: number;
    total_jobs: number;
    active_jobs: number;
    doorstep_jobs: number;
  };
  status_breakdown: Record<string, number>;
  payment_breakdown: Record<string, number>;
  recent_jobs: ServiceRecord[];
};

const STATUS_COLUMNS: ServiceStatus[] = ['Pending', 'In Progress', 'Completed', 'Delivered'];

const defaultForm = {
  customerName: '',
  customerPhone: '',
  vehicleBrand: '',
  carModel: '',
  plateNumber: '',
  serviceType: 'Ceramic Coating',
  amount: '',
  paymentMode: 'Cash' as PaymentMode,
  serviceLocation: 'In-Shop',
  notes: '',
  assignedTo: '',
};

function prettyDate(date?: string | null) {
  if (!date) return 'Just now';
  return new Date(date).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function OperationsDashboard() {
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async (search?: string) => {
    const [dashboardData, servicesData] = await Promise.all([
      fetchJson<DashboardPayload>('/api/legends/dashboard'),
      fetchJson<ServiceRecord[]>(
        search && search.trim().length >= 2
          ? `/api/legends/services?q=${encodeURIComponent(search.trim())}`
          : '/api/legends/services?limit=24'
      ),
    ]);
    setDashboard(dashboardData);
    setServices(servicesData);
  };

  useEffect(() => {
    loadDashboard()
      .catch((err) => setError(err instanceof Error ? err.message : 'Dashboard failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const servicesByStatus = useMemo(() => {
    return STATUS_COLUMNS.map((status) => ({
      status,
      items: services.filter((service) => service.status === status),
    }));
  }, [services]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await loadDashboard(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refresh failed');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await loadDashboard(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateJob = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await fetchJson<ServiceRecord>('/api/legends/services', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });
      setForm(defaultForm);
      await loadDashboard(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Job creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const moveStatus = async (service: ServiceRecord, status: ServiceStatus) => {
    try {
      await fetchJson<ServiceRecord>(`/api/legends/services/${service.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await loadDashboard(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-black/40 p-10 text-center text-zinc-300">
        <Loader2 className="mx-auto mb-4 animate-spin text-[#FFD700]" />
        Loading the control room...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-[2rem] border border-[#FFD700]/20 bg-gradient-to-br from-[#1a1404] to-black p-6 lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#FFD700]">Command Center</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white">Legend Ops Portal</h2>
            </div>
            <Sparkles className="text-[#FFD700]" />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">
            Live shop register, doorstep visibility, status progression, and client-ready turnover numbers in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-zinc-500">
            <span className="rounded-full border border-white/10 px-3 py-2">API: {API_BASE_URL}</span>
            <span className="rounded-full border border-white/10 px-3 py-2">Realtime-ready stack</span>
          </div>
        </div>

        {[
          {
            label: 'Today',
            value: formatCurrency(dashboard?.summary.daily_turnover ?? 0),
            icon: <BadgeIndianRupee className="text-[#FFD700]" />,
          },
          {
            label: 'Month',
            value: formatCurrency(dashboard?.summary.monthly_turnover ?? 0),
            icon: <Activity className="text-cyan-300" />,
          },
          {
            label: 'Active Jobs',
            value: String(dashboard?.summary.active_jobs ?? 0),
            icon: <Wrench className="text-emerald-300" />,
          },
        ].map((card) => (
          <div key={card.label} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-500">{card.label}</span>
              {card.icon}
            </div>
            <div className="text-3xl font-black tracking-tight text-white">{card.value}</div>
          </div>
        ))}
      </section>

      {error ? (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FFD700]">Workflow Board</p>
              <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Production pipeline</h3>
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
                  placeholder="Search plate, service, client"
                  className="w-72 rounded-2xl border border-white/10 bg-black px-10 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
                />
              </div>
              <button
                type="button"
                onClick={() => void handleRefresh()}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white"
              >
                {refreshing ? <Loader2 className="animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            {servicesByStatus.map((column) => (
              <div key={column.status} className="rounded-[1.5rem] border border-white/10 bg-[#090909] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">{column.status}</div>
                    <div className="mt-1 text-lg font-black text-white">{column.items.length}</div>
                  </div>
                  <Clock3 className="h-4 w-4 text-zinc-600" />
                </div>

                <div className="space-y-3">
                  {column.items.length > 0 ? (
                    column.items.map((service) => (
                      <div key={service.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-black uppercase tracking-wide text-white">{service.plate_number}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                              {service.vehicle_brand ? `${service.vehicle_brand} · ` : ''}
                              {service.car_model}
                            </div>
                          </div>
                          <div className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD700]">
                            {service.service_location || 'In-Shop'}
                          </div>
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-zinc-300">
                          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-zinc-600" /> {service.customer_name}</div>
                          {service.customer_phone ? <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-zinc-600" /> {service.customer_phone}</div> : null}
                          <div className="flex items-center gap-2"><CarFront className="h-4 w-4 text-zinc-600" /> {service.service_type}</div>
                          <div className="flex items-center gap-2"><BadgeIndianRupee className="h-4 w-4 text-zinc-600" /> {formatCurrency(service.amount)}</div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {STATUS_COLUMNS.filter((status) => status !== service.status).slice(0, 2).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => void moveStatus(service, status)}
                              className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-white transition hover:border-[#FFD700]/40 hover:text-[#FFD700]"
                            >
                              Move to {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-xs uppercase tracking-[0.22em] text-zinc-600">
                      No jobs here
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleCreateJob} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FFD700]">Quick Intake</p>
                <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Create a live job</h3>
              </div>
              <ArrowRight className="text-[#FFD700]" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                ['customerName', 'Client Name'],
                ['customerPhone', 'Phone'],
                ['vehicleBrand', 'Brand'],
                ['carModel', 'Model'],
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
                <option>Washing</option>
                <option>Ceramic Coating</option>
                <option>Paint Protection Film</option>
                <option>Detailing</option>
                <option>Anti Rust Coat</option>
              </select>
              <input
                value={form.amount}
                onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                placeholder="Amount"
                type="number"
                min="0"
                className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />
              <select
                value={form.paymentMode}
                onChange={(event) => setForm((current) => ({ ...current, paymentMode: event.target.value as PaymentMode }))}
                className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
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
                placeholder="Notes, promises, upsell opportunities"
                className="min-h-28 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 md:col-span-2"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFD700] px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-black"
            >
              {submitting ? <Loader2 className="animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Create Job
            </button>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FFD700]">Snapshots</p>
                <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Ops health</h3>
              </div>
              <MapPinned className="text-cyan-300" />
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">Doorstep Jobs</div>
                <div className="mt-2 text-3xl font-black text-white">{dashboard?.summary.doorstep_jobs ?? 0}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">Payment Mix</div>
                <div className="mt-3 flex gap-3 text-sm text-zinc-300">
                  <span>Cash: {dashboard?.payment_breakdown.Cash ?? 0}</span>
                  <span>Online: {dashboard?.payment_breakdown.Online ?? 0}</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">Recent Jobs</div>
                <div className="mt-3 space-y-3">
                  {dashboard?.recent_jobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="flex items-center justify-between gap-3 border-b border-white/6 pb-3 last:border-b-0 last:pb-0">
                      <div>
                        <div className="text-sm font-bold text-white">{job.plate_number}</div>
                        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{job.customer_name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#FFD700]">{formatCurrency(job.amount)}</div>
                        <div className="text-xs text-zinc-500">{prettyDate(job.check_in_time)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
