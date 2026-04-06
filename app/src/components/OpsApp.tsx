"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  CarFront,
  CircleDollarSign,
  ClipboardList,
  Loader2,
  LogOut,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { appHeaders, fetchJson } from "@/lib/api";

const STORAGE_KEY = "legends_ops_token";

const statuses = ["Pending", "In Progress", "Completed", "Delivered"] as const;

const serviceOptions = [
  "Paint Protection Film",
  "Ceramic Coating",
  "Graphene Coating",
  "Glass Coating",
  "Leather Coating",
  "Washing",
  "Rubbing & Dry Clean",
];

type AppUser = {
  id: number;
  username: string;
  full_name: string;
  role: "owner" | "employee";
};

type Job = {
  id: number;
  customer_id?: number | null;
  vehicle_id?: number | null;
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
  assigned_to?: string | null;
  notes?: string | null;
  check_in_time?: string | null;
};

type Vehicle = {
  id: number;
  customer_id?: number | null;
  plate_number: string;
  brand?: string | null;
  model: string;
  color?: string | null;
  fuel_type?: string | null;
  notes?: string | null;
};

type Customer = {
  id: number;
  full_name: string;
  phone?: string | null;
  alt_phone?: string | null;
  address?: string | null;
  notes?: string | null;
};

type RepeatLookup = {
  customer: Customer | null;
  vehicle: Vehicle | null;
  vehicles: Vehicle[];
  recent_jobs: Job[];
  legacy_suggestion: {
    customer?: { full_name?: string | null; phone?: string | null };
    vehicle?: { plate_number?: string | null; brand?: string | null; model?: string | null };
    job?: Job;
  } | null;
};

type Dashboard = {
  summary: {
    daily_turnover: number;
    monthly_turnover: number;
    total_jobs: number;
    active_jobs: number;
    total_customers: number;
    total_vehicles: number;
    repeat_customers: number;
  };
  recent_jobs: Job[];
  active_board: Job[];
};

type LoginPayload = {
  token: string;
  user: AppUser;
};

type IntakeState = {
  customerId: number | null;
  vehicleId: number | null;
  fullName: string;
  phone: string;
  altPhone: string;
  address: string;
  customerNotes: string;
  plateNumber: string;
  brand: string;
  model: string;
  color: string;
  fuelType: string;
  vehicleNotes: string;
  serviceType: string;
  amount: string;
  paymentMode: string;
  serviceLocation: string;
  assignedTo: string;
  notes: string;
};

const initialIntake: IntakeState = {
  customerId: null,
  vehicleId: null,
  fullName: "",
  phone: "",
  altPhone: "",
  address: "",
  customerNotes: "",
  plateNumber: "",
  brand: "",
  model: "",
  color: "",
  fuelType: "",
  vehicleNotes: "",
  serviceType: "Ceramic Coating",
  amount: "",
  paymentMode: "Cash",
  serviceLocation: "In-Shop",
  assignedTo: "",
  notes: "",
};

function money(value: number) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatTime(value?: string | null) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function LoginScreen({
  loading,
  error,
  onSubmit,
}: {
  loading: boolean;
  error: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <main className="ops-shell ops-grid-bg flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-black/10 bg-[var(--panel)] shadow-[0_30px_80px_rgba(0,0,0,0.08)] lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative hidden overflow-hidden bg-[#111111] p-8 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(216,163,34,0.28),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(224,35,35,0.18),transparent_30%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white">
              Tablet-first ops app
            </div>
            <div className="space-y-6">
              <div className="relative mx-auto h-56 w-72 overflow-hidden rounded-[2rem] border border-white/10 bg-[#f8f0de] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <Image src="/legend-logo.png" alt="The Legend Detailer" fill sizes="288px" className="object-contain object-top mix-blend-multiply" />
              </div>
              <div className="space-y-3 text-white">
                <h2 className="text-4xl font-black uppercase tracking-tight">The Legend Detailer</h2>
                <p className="text-sm leading-relaxed text-white/72">
                  Intake, repeat-customer autofill, and workshop monitoring designed for the owner and a small employee team using phones or tablets.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-10">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/10 bg-white p-2 shadow-[0_18px_40px_rgba(0,0,0,0.08)] lg:hidden">
              <Image src="/legend-logo.png" alt="The Legend Detailer" fill sizes="64px" className="object-contain object-top" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white">
              <Sparkles className="h-4 w-4 text-[var(--gold)]" />
              The Legend Detailer Ops
            </div>
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-[var(--text)]">
            Smooth login for owner and employees
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Secure access to repeat-customer autofill, customer history, and live car workflow. Built to be fast, simple, and stress-free on tablets.
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            name="username"
            defaultValue="admin"
            placeholder="Username"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-base outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-base outline-none"
          />
          {error ? (
            <div className="rounded-2xl border border-[var(--red)]/20 bg-[var(--red)]/8 px-4 py-3 text-sm text-[var(--red)]">
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_30px_rgba(0,0,0,0.14)] transition-transform hover:scale-[1.01]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[var(--gold)]" />}
            {loading ? "Signing in..." : "Open The Legend Detailer Ops"}
          </button>
        </form>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-black/10 bg-[var(--panel)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
      <div className="mb-5 flex items-center justify-between text-[var(--muted)]">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{label}</span>
        {icon}
      </div>
      <div className="text-3xl font-black tracking-tight text-[var(--text)]">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string | null }) {
  const palette =
    status === "Completed"
      ? "bg-emerald-100 text-emerald-700"
      : status === "In Progress"
        ? "bg-sky-100 text-sky-700"
        : status === "Delivered"
          ? "bg-violet-100 text-violet-700"
          : "bg-amber-100 text-amber-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${palette}`}>
      {status || "Pending"}
    </span>
  );
}

export default function OpsApp() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [lookup, setLookup] = useState<RepeatLookup | null>(null);
  const [lookupQuery, setLookupQuery] = useState("");
  const [intake, setIntake] = useState<IntakeState>(initialIntake);
  const [checking, setChecking] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupedJobs = useMemo(
    () =>
      statuses.map((status) => ({
        status,
        items: jobs.filter((job) => job.status === status),
      })),
    [jobs]
  );

  async function loadOpsData(activeToken: string) {
    const [dashboardData, jobsData] = await Promise.all([
      fetchJson<Dashboard>("/api/legends/ops/dashboard", { headers: appHeaders(activeToken) }),
      fetchJson<Job[]>("/api/legends/ops/jobs", { headers: appHeaders(activeToken) }),
    ]);
    setDashboard(dashboardData);
    setJobs(jobsData);
  }

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setChecking(false);
      return;
    }

    fetchJson<{ status: string; user: AppUser }>("/api/legends/ops/auth/session", {
      headers: appHeaders(stored),
    })
      .then(async (payload) => {
        setToken(stored);
        setUser(payload.user);
        await loadOpsData(stored);
      })
      .catch(() => {
        window.localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setChecking(false));
  }, []);

  function applyLookupSelection(customer?: Customer | null, vehicle?: Vehicle | null) {
    setIntake((current) => ({
      ...current,
      customerId: customer?.id ?? current.customerId,
      vehicleId: vehicle?.id ?? current.vehicleId,
      fullName: customer?.full_name ?? current.fullName,
      phone: customer?.phone ?? current.phone,
      altPhone: customer?.alt_phone ?? current.altPhone,
      address: customer?.address ?? current.address,
      customerNotes: customer?.notes ?? current.customerNotes,
      plateNumber: vehicle?.plate_number ?? current.plateNumber,
      brand: vehicle?.brand ?? current.brand,
      model: vehicle?.model ?? current.model,
      color: vehicle?.color ?? current.color,
      fuelType: vehicle?.fuel_type ?? current.fuelType,
      vehicleNotes: vehicle?.notes ?? current.vehicleNotes,
    }));
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);

    try {
      const payload = await fetchJson<LoginPayload>("/api/legends/ops/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: String(form.get("username") ?? ""),
          password: String(form.get("password") ?? ""),
        }),
      });
      window.localStorage.setItem(STORAGE_KEY, payload.token);
      setToken(payload.token);
      setUser(payload.user);
      await loadOpsData(payload.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setChecking(false);
      setLoginLoading(false);
    }
  }

  async function handleLookup() {
    if (!token || !lookupQuery.trim()) return;
    setLookupLoading(true);
    setError(null);
    try {
      const clean = lookupQuery.trim();
      const path = clean.match(/^\d{8,}$/)
        ? `/api/legends/ops/lookups/repeat?phone=${encodeURIComponent(clean)}`
        : clean.length >= 5 && /[a-z0-9]/i.test(clean)
          ? `/api/legends/ops/lookups/repeat?plate=${encodeURIComponent(clean)}`
          : `/api/legends/ops/lookups/repeat?q=${encodeURIComponent(clean)}`;
      const payload = await fetchJson<RepeatLookup>(path, {
        headers: appHeaders(token),
      });
      setLookup(payload);
      if (payload.customer || payload.vehicle) {
        applyLookupSelection(payload.customer, payload.vehicle ?? payload.vehicles[0] ?? null);
      } else if (payload.legacy_suggestion) {
        setIntake((current) => ({
          ...current,
          fullName: payload.legacy_suggestion?.customer?.full_name ?? current.fullName,
          phone: payload.legacy_suggestion?.customer?.phone ?? current.phone,
          plateNumber: payload.legacy_suggestion?.vehicle?.plate_number ?? current.plateNumber,
          brand: payload.legacy_suggestion?.vehicle?.brand ?? current.brand,
          model: payload.legacy_suggestion?.vehicle?.model ?? current.model,
          serviceType: payload.legacy_suggestion?.job?.service_type ?? current.serviceType,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleCreateJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSaveLoading(true);
    setError(null);
    try {
      await fetchJson("/api/legends/ops/jobs", {
        method: "POST",
        headers: appHeaders(token),
        body: JSON.stringify({
          customer: {
            id: intake.customerId,
            fullName: intake.fullName,
            phone: intake.phone,
            altPhone: intake.altPhone,
            address: intake.address,
            notes: intake.customerNotes,
          },
          vehicle: {
            id: intake.vehicleId,
            plateNumber: intake.plateNumber,
            brand: intake.brand,
            model: intake.model,
            color: intake.color,
            fuelType: intake.fuelType,
            notes: intake.vehicleNotes,
          },
          serviceType: intake.serviceType,
          amount: Number(intake.amount),
          paymentMode: intake.paymentMode,
          serviceLocation: intake.serviceLocation,
          assignedTo: intake.assignedTo,
          notes: intake.notes,
        }),
      });
      setIntake(initialIntake);
      setLookup(null);
      setLookupQuery("");
      await loadOpsData(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Job creation failed");
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleStatusChange(jobId: number, status: string) {
    if (!token) return;
    try {
      await fetchJson(`/api/legends/ops/jobs/${jobId}`, {
        method: "PATCH",
        headers: appHeaders(token),
        body: JSON.stringify({ status }),
      });
      await loadOpsData(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
    setDashboard(null);
    setJobs([]);
    setLookup(null);
    setIntake(initialIntake);
  }

  if (checking) {
    return (
      <main className="ops-shell flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 rounded-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--gold)]" />
          Loading Legends Ops
        </div>
      </main>
    );
  }

  if (!token || !user) {
    return <LoginScreen loading={loginLoading} error={error} onSubmit={handleLogin} />;
  }

  return (
    <main className="ops-shell ops-grid-bg px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[34px] border border-black/10 bg-[var(--panel)] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative h-20 w-24 overflow-hidden rounded-[1.4rem] border border-black/10 bg-[#f8f0de] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
                  <Image src="/legend-logo.png" alt="The Legend Detailer" fill sizes="96px" className="object-contain object-top mix-blend-multiply" />
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white">
                  <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                  The Legend Detailer Ops App
                </div>
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)]">
                Fast intake for owner and employees
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                Search repeat customers by phone or plate, auto-fill old details, update live job status, and monitor every active car from one simple tablet-first workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Logged in
                </div>
                <div className="mt-1 text-sm font-bold text-[var(--text)]">
                  {user.full_name} · {user.role}
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-[var(--text)]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </section>

        {dashboard ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <MetricCard label="Today" value={money(dashboard.summary.daily_turnover)} icon={<CircleDollarSign className="h-5 w-5" />} />
            <MetricCard label="Month" value={money(dashboard.summary.monthly_turnover)} icon={<CircleDollarSign className="h-5 w-5" />} />
            <MetricCard label="Active Jobs" value={String(dashboard.summary.active_jobs)} icon={<ClipboardList className="h-5 w-5" />} />
            <MetricCard label="Customers" value={String(dashboard.summary.total_customers)} icon={<Users className="h-5 w-5" />} />
            <MetricCard label="Vehicles" value={String(dashboard.summary.total_vehicles)} icon={<CarFront className="h-5 w-5" />} />
            <MetricCard label="Repeat Clients" value={String(dashboard.summary.repeat_customers)} icon={<Users className="h-5 w-5" />} />
          </section>
        ) : null}

        {dashboard ? (
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-[30px] border border-black/10 bg-[#111111] p-6 shadow-[0_22px_50px_rgba(0,0,0,0.12)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
                    Workshop pulse
                  </div>
                  <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
                    The Legend Detailer is ready for quick repeat intake
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
                    Search by phone or plate, pull old customer details, and create the next job without making the staff type the same information again.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    `${dashboard.summary.active_jobs} active`,
                    `${dashboard.summary.total_customers} customers`,
                    `${dashboard.summary.total_vehicles} vehicles`,
                    `${dashboard.summary.repeat_customers} repeat`,
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm font-bold text-white">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-black/10 bg-[var(--panel)] p-5 shadow-[0_22px_50px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Recent activity</div>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--text)]">Latest jobs</h2>
                </div>
                <div className="rounded-full bg-[#f4ead1] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7c5d13]">
                  Live
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {dashboard.recent_jobs.slice(0, 4).map((job) => (
                  <div key={job.id} className="rounded-2xl border border-black/10 bg-[#faf7f1] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-black text-[var(--text)]">{job.customer_name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                          {job.plate_number} · {job.car_model}
                        </div>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                      <span className="text-[var(--muted)]">{job.service_type}</span>
                      <span className="font-bold text-[var(--text)]">{money(job.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {error ? (
          <div className="rounded-[24px] border border-[var(--red)]/20 bg-[var(--panel)] px-5 py-4 text-sm text-[var(--red)] shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
            {error}
          </div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-6">
            <div className="rounded-[30px] border border-black/10 bg-[var(--panel)] p-5 shadow-[0_22px_50px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#111111] p-3 text-white">
                  <Search className="h-5 w-5 text-[var(--gold)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[var(--text)]">Repeat customer autofill</h2>
                  <p className="text-sm text-[var(--muted)]">Search by phone, plate number, or customer name.</p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <input
                  value={lookupQuery}
                  onChange={(event) => setLookupQuery(event.target.value)}
                  placeholder="Phone, plate, or customer name"
                  className="min-w-0 flex-1 rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 text-base outline-none transition-colors focus:border-[var(--gold)]"
                />
                <button
                  type="button"
                  onClick={() => void handleLookup()}
                  disabled={lookupLoading}
                  className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white"
                >
                  {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </button>
              </div>

              {lookup ? (
                <div className="mt-5 space-y-4">
                  {lookup.customer ? (
                    <div className="rounded-2xl border border-black/10 bg-[#faf7f1] p-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Matched customer</div>
                      <div className="mt-2 text-lg font-black text-[var(--text)]">{lookup.customer.full_name}</div>
                      <div className="mt-1 text-sm text-[var(--muted)]">{lookup.customer.phone || "No phone stored"}</div>
                      <button
                        type="button"
                        onClick={() => applyLookupSelection(lookup.customer, lookup.vehicle ?? lookup.vehicles[0] ?? null)}
                        className="mt-3 rounded-xl bg-[var(--gold)] px-4 py-2 text-sm font-bold text-black"
                      >
                        Use customer details
                      </button>
                    </div>
                  ) : null}

                  {lookup.vehicles.length > 0 ? (
                    <div className="grid gap-3">
                      {lookup.vehicles.map((vehicle) => (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => applyLookupSelection(lookup.customer, vehicle)}
                          className="rounded-2xl border border-black/10 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--gold)]/50"
                        >
                          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Saved vehicle</div>
                          <div className="mt-2 text-base font-black text-[var(--text)]">
                            {vehicle.plate_number} · {vehicle.brand || "Brand"} · {vehicle.model}
                          </div>
                          <div className="mt-1 text-sm text-[var(--muted)]">
                            {vehicle.color || "No color"} {vehicle.fuel_type ? `· ${vehicle.fuel_type}` : ""}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {lookup.legacy_suggestion ? (
                    <div className="rounded-2xl border border-black/10 bg-[#fff7dd] p-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Legacy suggestion</div>
                      <div className="mt-2 text-sm leading-relaxed text-[var(--text)]">
                        Older job found from previous records. Use it to prefill basic customer or car details.
                      </div>
                    </div>
                  ) : null}

                  {lookup.recent_jobs.length > 0 ? (
                    <div className="rounded-2xl border border-black/10 bg-white p-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Recent jobs</div>
                      <div className="mt-3 space-y-3">
                        {lookup.recent_jobs.slice(0, 3).map((job) => (
                          <div key={job.id} className="rounded-2xl border border-black/5 bg-[#faf7f1] p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="text-sm font-black text-[var(--text)]">{job.service_type}</div>
                                <div className="text-xs text-[var(--muted)]">{job.plate_number} · {formatTime(job.check_in_time)}</div>
                              </div>
                              <div className="text-sm font-bold text-[var(--text)]">{money(job.amount)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <form onSubmit={handleCreateJob} className="rounded-[30px] border border-black/10 bg-[var(--panel)] p-5 shadow-[0_22px_50px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col gap-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">New intake</div>
              <h2 className="text-3xl font-black tracking-tight text-[var(--text)]">Create a job in under one minute</h2>
              <p className="text-sm text-[var(--muted)]">
                Fill customer and vehicle once, then keep using repeat-customer search for future visits.
              </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <input value={intake.fullName} onChange={(e) => setIntake({ ...intake, fullName: e.target.value })} placeholder="Customer full name" className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]" />
              <input value={intake.phone} onChange={(e) => setIntake({ ...intake, phone: e.target.value })} placeholder="Phone number" className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]" />
              <input value={intake.altPhone} onChange={(e) => setIntake({ ...intake, altPhone: e.target.value })} placeholder="Alt phone" className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]" />
              <input value={intake.address} onChange={(e) => setIntake({ ...intake, address: e.target.value })} placeholder="Address" className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]" />
              <input value={intake.plateNumber} onChange={(e) => setIntake({ ...intake, plateNumber: e.target.value.toUpperCase() })} placeholder="Plate number" className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]" />
              <input value={intake.brand} onChange={(e) => setIntake({ ...intake, brand: e.target.value })} placeholder="Vehicle brand" className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]" />
              <input value={intake.model} onChange={(e) => setIntake({ ...intake, model: e.target.value })} placeholder="Vehicle model" className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]" />
              <input value={intake.color} onChange={(e) => setIntake({ ...intake, color: e.target.value })} placeholder="Color" className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]" />
              <input value={intake.fuelType} onChange={(e) => setIntake({ ...intake, fuelType: e.target.value })} placeholder="Fuel type" className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]" />
              <input value={intake.assignedTo} onChange={(e) => setIntake({ ...intake, assignedTo: e.target.value })} placeholder="Assigned employee" className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]" />

              <select value={intake.serviceType} onChange={(e) => setIntake({ ...intake, serviceType: e.target.value })} className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]">
                {serviceOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <input value={intake.amount} onChange={(e) => setIntake({ ...intake, amount: e.target.value })} type="number" placeholder="Amount" className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]" />

              <select value={intake.paymentMode} onChange={(e) => setIntake({ ...intake, paymentMode: e.target.value })} className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]">
                <option>Cash</option>
                <option>Online / UPI</option>
              </select>

              <select value={intake.serviceLocation} onChange={(e) => setIntake({ ...intake, serviceLocation: e.target.value })} className="rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)]">
                <option>In-Shop</option>
                <option>Doorstep</option>
              </select>

              <textarea value={intake.customerNotes} onChange={(e) => setIntake({ ...intake, customerNotes: e.target.value })} placeholder="Customer notes" className="min-h-28 rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)] lg:col-span-2" />
              <textarea value={intake.vehicleNotes} onChange={(e) => setIntake({ ...intake, vehicleNotes: e.target.value })} placeholder="Vehicle notes" className="min-h-28 rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)] lg:col-span-2" />
              <textarea value={intake.notes} onChange={(e) => setIntake({ ...intake, notes: e.target.value })} placeholder="Job notes, requests, add-ons, finish promise" className="min-h-32 rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-4 outline-none transition-colors focus:border-[var(--gold)] lg:col-span-2" />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-[var(--muted)]">
                Repeat customer flow will fill these details automatically when phone or plate already exists.
              </div>
              <button
                type="submit"
                disabled={saveLoading}
                className="inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white"
              >
                {saveLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[var(--gold)]" />}
                {saveLoading ? "Saving..." : "Create Job"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-[30px] border border-black/10 bg-[var(--panel)] p-5 shadow-[0_22px_50px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Live board</div>
              <h2 className="text-3xl font-black tracking-tight text-[var(--text)]">Every car currently in the workshop flow</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-4">
            {groupedJobs.map((group) => (
              <div key={group.status} className="rounded-[24px] border border-black/10 bg-[#faf7f1] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-black uppercase tracking-[0.12em] text-[var(--text)]">{group.status}</div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--muted)]">{group.items.length}</div>
                </div>
                <div className="mt-4 space-y-3">
                  {group.items.length > 0 ? (
                    group.items.map((job) => (
                      <div key={job.id} className="rounded-2xl border border-black/10 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-base font-black text-[var(--text)]">{job.customer_name}</div>
                            <div className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                              {job.plate_number} · {job.vehicle_brand || "Brand"} · {job.car_model}
                            </div>
                          </div>
                          <div className="space-y-2 text-right">
                            <div className="text-sm font-bold text-[var(--text)]">{money(job.amount)}</div>
                            <StatusBadge status={job.status} />
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-[var(--muted)]">{job.service_type}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">
                          {job.service_location || "In-Shop"} · {job.assigned_to || "Unassigned"} · {formatTime(job.check_in_time)}
                        </div>
                        <select
                          value={job.status || "Pending"}
                          onChange={(event) => void handleStatusChange(job.id, event.target.value)}
                          className="mt-3 w-full rounded-xl border border-black/10 bg-[#faf7f1] px-3 py-3 text-sm font-bold outline-none"
                        >
                          {statuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-black/10 bg-white px-4 py-8 text-center text-sm text-[var(--muted)]">
                      No jobs in this stage right now.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
