import { useState } from "react";
import {
  Building2, Shield, Users, Globe, Lock,
  ChevronRight, ArrowLeft, CheckCircle, X, Smartphone
} from "lucide-react";

type Role = "citizen" | "inspector" | "executive";
type Step = "home" | "citizen-auth" | "admin-modal" | "phone-otp";

interface LandingPageProps {
  onLogin: (role: Role) => void;
}

const CITIZEN_METHODS = [
  {
    id: "sima",
    name: "SİMA",
    desc: "Şəxsiyyəti müəyyənləşdirmə sistemi",
    emoji: "🪪",
    tag: "Tövsiyə olunur",
    tagCls: "bg-blue-100 text-blue-700",
    grad: "from-blue-500 to-blue-700",
    isPhone: false,
  },
  {
    id: "asan",
    name: "Asan İmza",
    desc: "Mobil elektron imza xidməti",
    emoji: "✍️",
    tag: "Sürətli",
    tagCls: "bg-emerald-100 text-emerald-700",
    grad: "from-emerald-500 to-emerald-700",
    isPhone: false,
  },
  {
    id: "id",
    name: "İdentifikasiya nömrəsi",
    desc: "Şəxsiyyət vəsiqəsi nömrəsi ilə",
    emoji: "🪙",
    tag: "ID Kart",
    tagCls: "bg-violet-100 text-violet-700",
    grad: "from-violet-500 to-violet-700",
    isPhone: false,
  },
  {
    id: "mygov",
    name: "myGov",
    desc: "Dövlət e-xidmətlər portalı",
    emoji: "🏛️",
    tag: "Portal",
    tagCls: "bg-amber-100 text-amber-700",
    grad: "from-amber-500 to-orange-600",
    isPhone: false,
  },
  {
    id: "phone",
    name: "Telefon nömrəsi",
    desc: "Telefon nömrəsi ilə qeydiyyat/giriş",
    emoji: "📱",
    tag: "SMS OTP",
    tagCls: "bg-rose-100 text-rose-700",
    grad: "from-rose-500 to-pink-600",
    isPhone: true,
  },
];

export function LandingPage({ onLogin }: LandingPageProps) {
  const [step, setStep] = useState<Step>("home");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const triggerLogin = (role: Role, id: string) => {
    setLoadingId(id);
    setTimeout(() => {
      setLoadingId(null);
      onLogin(role);
    }, 1400);
  };

  const handleSendOtp = () => {
    if (phoneNumber.replace(/\D/g, "").length < 9) {
      setPhoneError("Düzgün telefon nömrəsi daxil edin");
      return;
    }
    setPhoneError("");
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4) {
      setPhoneError("Düzgün OTP kodu daxil edin");
      return;
    }
    triggerLogin("citizen", "phone");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#07101f] via-[#0c1c3d] to-[#07101f] relative overflow-hidden">
      {/* grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(96,165,250,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,.06) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      {/* glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold" style={{ fontSize: "1.05rem" }}>Nərimanov SmartOps</p>
            <p className="text-blue-300/70 text-xs">Ağıllı Şəhər İdarəetmə Platforması</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          Sistem Aktiv · v2.4
        </div>
      </header>

      {/* ── Main ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">

        {/* ════ HOME ════ */}
        {step === "home" && (
          <div className="w-full max-w-3xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                Nərimanov Rayonu — Azərbaycan Respublikası
              </div>
              <h1
                className="text-white mb-4"
                style={{ fontSize: "clamp(2rem,5vw,3.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" }}
              >
                Ağıllı Şəhər
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  İdarəetmə Mərkəzi
                </span>
              </h1>
              <p className="text-slate-400 max-w-xl mx-auto text-sm" style={{ lineHeight: 1.75 }}>
                Nərimanov SmartOps — şəhər infrastrukturunun real vaxtda idarəsi, vətəndaş müraciətlərinin AI ilə avtomatik yönləndirilməsi və sahə mühəndislərinin koordinasiyası platforması.
              </p>
            </div>

            {/* Two main entry cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {/* Vətəndaş */}
              <button
                onClick={() => setStep("citizen-auth")}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-7 text-left hover:border-blue-400/40 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="absolute bottom-0 left-0 right-0 h-px rounded-b-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center mb-5 w-14 h-14 shadow-lg shadow-blue-500/25">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-white mb-1" style={{ fontSize: "1.4rem", fontWeight: 700 }}>Vətəndaş</h2>
                <p className="text-slate-400 text-sm mb-5" style={{ lineHeight: 1.65 }}>
                  Şikayət bildirin, müraciətlərinizi izləyin, şəhər təkliflərini dəstəkləyin.
                </p>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                  Giriş et <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Admin */}
              <button
                onClick={() => setStep("admin-modal")}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-7 text-left hover:border-violet-400/40 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="absolute bottom-0 left-0 right-0 h-px rounded-b-2xl bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mb-5 shadow-lg shadow-violet-500/25">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-white mb-1" style={{ fontSize: "1.4rem", fontWeight: 700 }}>Admin</h2>
                <p className="text-slate-400 text-sm mb-5" style={{ lineHeight: 1.65 }}>
                  Müfəttişlər və İcra Hakimiyyəti üçün xüsusi idarəetmə paneli.
                </p>
                <div className="flex items-center gap-2 text-violet-400 text-sm font-medium group-hover:gap-3 transition-all">
                  Giriş et <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* stats */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {[
                { label: "Aktiv Müraciət", value: "1,247" },
                { label: "Həll Edilmiş", value: "8,932" },
                { label: "Müfəttiş", value: "64" },
                { label: "Orta Cavab", value: "2.4 saat" },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                  <div className="text-white font-bold" style={{ fontSize: "1.3rem" }}>{s.value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ CITIZEN AUTH ════ */}
        {step === "citizen-auth" && (
          <div className="w-full max-w-md">
            <button
              onClick={() => setStep("home")}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-7 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Geri
            </button>

            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold" style={{ fontSize: "1.3rem" }}>Vətəndaş Girişi</h2>
                <p className="text-slate-400 text-xs">Autentifikasiya metodunu seçin</p>
              </div>
            </div>

            <div className="space-y-3">
              {CITIZEN_METHODS.map((m) => {
                const isLoading = loadingId === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => m.isPhone ? setStep("phone-otp") : triggerLogin("citizen", m.id)}
                    disabled={!!loadingId}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200
                      ${isLoading
                        ? "border-white/30 bg-white/10"
                        : m.isPhone
                          ? "border-rose-500/30 bg-rose-500/[0.06] hover:border-rose-400/50 hover:bg-rose-500/[0.10]"
                          : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]"
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.grad} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                      {isLoading
                        ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : m.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-semibold">{m.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.tagCls}`}>{m.tag}</span>
                      </div>
                      <p className="text-slate-400 text-xs">{m.desc}</p>
                    </div>
                    {isLoading
                      ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-slate-600 text-xs mt-6">Məlumatlarınız şifrələnərək qorunur · AES-256</p>
          </div>
        )}

        {/* ════ PHONE OTP ════ */}
        {step === "phone-otp" && (
          <div className="w-full max-w-md">
            <button
              onClick={() => { setStep("citizen-auth"); setOtpSent(false); setPhoneNumber(""); setOtpCode(""); setPhoneError(""); }}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-7 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Geri
            </button>

            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold" style={{ fontSize: "1.3rem" }}>Telefon ilə Giriş</h2>
                <p className="text-slate-400 text-xs">Nömrənizi daxil edin, SMS kodu göndəriləcək</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 space-y-4">
              {/* Phone input */}
              <div>
                <label className="text-slate-300 text-xs font-medium block mb-2">Telefon nömrəsi</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/15 bg-white/[0.06] text-white text-sm font-medium flex-shrink-0">
                    🇦🇿 +994
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="50 123 45 67"
                    disabled={otpSent}
                    className="flex-1 bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-400/50 focus:ring-1 focus:ring-rose-400/30 disabled:opacity-50"
                  />
                </div>
                {phoneError && <p className="text-rose-400 text-xs mt-1.5">{phoneError}</p>}
              </div>

              {/* OTP field — shown after send */}
              {otpSent && (
                <div>
                  <label className="text-slate-300 text-xs font-medium block mb-2">
                    SMS kodu <span className="text-slate-500">({phoneNumber} nömrəsinə göndərildi)</span>
                  </label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map(i => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={otpCode[i] || ""}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/, "");
                          const arr = otpCode.split("");
                          arr[i] = val;
                          setOtpCode(arr.join(""));
                          if (val && e.currentTarget.nextElementSibling) {
                            (e.currentTarget.nextElementSibling as HTMLInputElement).focus();
                          }
                        }}
                        className="w-12 h-12 text-center text-white bg-white/[0.08] border border-white/15 rounded-xl text-lg font-bold focus:outline-none focus:border-rose-400/60 focus:ring-1 focus:ring-rose-400/30"
                      />
                    ))}
                    <button
                      onClick={() => { setOtpSent(false); setOtpCode(""); }}
                      className="ml-auto text-xs text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      Yenidən göndər
                    </button>
                  </div>
                  {phoneError && <p className="text-rose-400 text-xs mt-1.5">{phoneError}</p>}
                </div>
              )}

              {/* Action button */}
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium text-sm hover:opacity-90 transition-all shadow-lg shadow-rose-500/20"
                >
                  SMS Kodu Göndər
                </button>
              ) : (
                <button
                  onClick={handleVerifyOtp}
                  disabled={!!loadingId}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium text-sm hover:opacity-90 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-60"
                >
                  {loadingId === "phone"
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Yoxlanılır...</>
                    : "Doğrula və Daxil Ol"}
                </button>
              )}
            </div>
            <p className="text-center text-slate-600 text-xs mt-5">Nömrəniz yalnız autentifikasiya üçün istifadə olunur</p>
          </div>
        )}

        {/* ════ ADMIN MODAL ════ */}
        {step === "admin-modal" && (
          <div className="w-full max-w-md">
            <button
              onClick={() => setStep("home")}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-7 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Geri
            </button>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md overflow-hidden shadow-2xl">
              {/* modal header */}
              <div className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 border-b border-white/10 p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold" style={{ fontSize: "1.15rem" }}>Admin Girişi</h2>
                  <p className="text-violet-300/70 text-xs">İdarəetmə rolunu seçin</p>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {/* Inspector */}
                {(() => {
                  const isLoading = loadingId === "inspector";
                  return (
                    <button
                      onClick={() => triggerLogin("inspector", "inspector")}
                      disabled={!!loadingId}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200
                        ${isLoading ? "border-emerald-400/50 bg-emerald-500/10" : "border-white/10 bg-white/[0.04] hover:border-emerald-400/40 hover:bg-emerald-500/[0.07]"}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                        {isLoading
                          ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <Shield className="w-6 h-6 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white font-semibold">Müfəttiş</span>
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Sahə Mühəndisi</span>
                        </div>
                        <p className="text-slate-400 text-xs">Tapşırıqları idarə et, marşrut planlaşdır, hesabat ver</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  );
                })()}

                {/* Executive */}
                {(() => {
                  const isLoading = loadingId === "executive";
                  return (
                    <button
                      onClick={() => triggerLogin("executive", "executive")}
                      disabled={!!loadingId}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200
                        ${isLoading ? "border-violet-400/50 bg-violet-500/10" : "border-white/10 bg-white/[0.04] hover:border-violet-400/40 hover:bg-violet-500/[0.07]"}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
                        {isLoading
                          ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <Building2 className="w-6 h-6 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white font-semibold">İcra Hakimiyyəti</span>
                          <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">Rəhbərlik</span>
                        </div>
                        <p className="text-slate-400 text-xs">Analitika, arxiv, SLA nəzarəti və elanlar</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  );
                })()}
              </div>

              <div className="px-5 pb-5">
                <p className="text-center text-slate-600 text-xs">Bu giriş yalnız səlahiyyətli şəxslər üçündür. Bütün daxilolmalar qeydə alınır.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="relative z-10 text-center py-3 border-t border-white/[0.06] text-slate-600 text-xs">
        © 2026 Nərimanov Rayon İcra Hakimiyyəti — SmartOps Platform v2.4
      </footer>
    </div>
  );
}
