"use client";

import { useState, useEffect, useRef } from "react";
import { WHATSAPP_URL } from "@/lib/constants";

type Step =
  | "q1_has_company"
  | "q1_disqualified"
  | "q1b_role"
  | "q2_company_name"
  | "q3_revenue"
  | "q4_contact_name"
  | "q5_email"
  | "q6_phone"
  | "success";

interface FormData {
  hasCompany: string;
  role: string;
  companyName: string;
  revenue: string;
  contactName: string;
  email: string;
  phone: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
}

const REVENUE_OPTIONS = [
  { value: "ate_50k",     label: "Até R$ 50.000" },
  { value: "50k_200k",   label: "R$ 50.000 – R$ 200.000" },
  { value: "200k_500k",  label: "R$ 200.000 – R$ 500.000" },
  { value: "acima_500k", label: "Acima de R$ 500.000" },
];

const ROLE_OPTIONS = ["Dono", "Diretor", "Gerente", "Funcionário"];

const BR_PHONE_RE = /^\(\d{2}\) \d{4,5}-\d{4}$/;

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const STEP_ORDER: Step[] = [
  "q1_has_company",
  "q1b_role",
  "q2_company_name",
  "q3_revenue",
  "q4_contact_name",
  "q5_email",
  "q6_phone",
  "success",
];

function getProgress(step: Step): number {
  const idx = STEP_ORDER.indexOf(step);
  if (idx <= 0) return 0;
  return Math.round((idx / (STEP_ORDER.length - 1)) * 100);
}

function getUtmParams() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source:   p.get("utm_source")   || "",
    utm_medium:   p.get("utm_medium")   || "",
    utm_campaign: p.get("utm_campaign") || "",
    utm_term:     p.get("utm_term")     || "",
  };
}

export default function Quiz() {
  const [step, setStep]         = useState<Step>("q1_has_company");
  const [formData, setFormData] = useState<FormData>({
    hasCompany: "", role: "", companyName: "", revenue: "",
    contactName: "", email: "", phone: "",
    utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData((p) => ({ ...p, ...getUtmParams() }));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [step]);

  const STEP_FIELD: Partial<Record<Step, keyof FormData>> = {
    q2_company_name: "companyName",
    q4_contact_name: "contactName",
    q5_email:        "email",
    q6_phone:        "phone",
  };

  function goBack() {
    const idx = STEP_ORDER.indexOf(step);
    if (idx <= 0) return;
    const prevStep = STEP_ORDER[idx - 1];
    const prevField = STEP_FIELD[prevStep];
    setStep(prevStep);
    setError("");
    setInputValue(prevField ? (formData[prevField] as string) : "");
  }

  function handleYesNo(value: "sim" | "nao") {
    if (value === "nao") {
      setFormData((p) => ({ ...p, hasCompany: "nao" }));
      setStep("q1_disqualified");
    } else {
      setFormData((p) => ({ ...p, hasCompany: "sim" }));
      setStep("q1b_role");
    }
  }

  function handleRole(value: string) {
    setFormData((p) => ({ ...p, role: value }));
    setStep("q2_company_name");
  }

  function handleRevenue(value: string) {
    setFormData((p) => ({ ...p, revenue: value }));
    setStep("q4_contact_name");
  }

  function handleTextNext(field: keyof FormData, next: Step) {
    if (!inputValue.trim()) { setError("Campo obrigatório."); return; }
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
      setError("Informe um e-mail válido."); return;
    }
    setFormData((p) => ({ ...p, [field]: inputValue.trim() }));
    setInputValue(""); setError(""); setStep(next);
  }

  async function handlePhoneNext() {
    if (!inputValue.trim()) { setError("Campo obrigatório."); return; }
    const clean = inputValue.replace(/\D/g, "");
    if (!BR_PHONE_RE.test(inputValue) || clean.length < 10) {
      setError("Telefone inválido. Ex: (48) 99999-9999"); return;
    }
    const finalData = { ...formData, phone: inputValue.trim() };
    setFormData(finalData);
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      if (!res.ok) throw new Error("server_error");
    } catch {
      setLoading(false);
      setError("Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.");
      return;
    }

    // DataLayer event para GTM
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).dataLayer = (window as any).dataLayer || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).dataLayer.push({
        event: "quiz_lead_submitted",
        cargo: finalData.role,
        faturamento: finalData.revenue,
        utm_source: finalData.utm_source,
        utm_medium: finalData.utm_medium,
        utm_campaign: finalData.utm_campaign,
        utm_term: finalData.utm_term,
      });
    }

    setLoading(false);
    setInputValue("");
    setStep("success");
  }

  const progress = getProgress(step);
  const showBack =
    step !== "q1_has_company" &&
    step !== "q1_disqualified" &&
    step !== "success";

  const showProgress =
    step !== "q1_disqualified" && step !== "success";

  return (
    <div className="qz-wrap">
      {showProgress && (
        <div className="qz-progress">
          <div className="qz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="qz-card" key={step}>
        {showBack && (
          <button className="qz-back" onClick={goBack} type="button">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Voltar
          </button>
        )}

        {/* Q1 — Possui empresa? */}
        {step === "q1_has_company" && (
          <div className="qz-step">
            <div className="qz-counter">01 / 07</div>
            <h3 className="qz-question">Você possui uma empresa?</h3>
            <div className="qz-options-col">
              <button className="qz-opt-primary" onClick={() => handleYesNo("sim")}>Sim</button>
              <button className="qz-opt-ghost"   onClick={() => handleYesNo("nao")}>Não</button>
            </div>
          </div>
        )}

        {/* Desqualificado */}
        {step === "q1_disqualified" && (
          <div className="qz-step">
            <h3 className="qz-question">Obrigado pelo interesse.</h3>
            <p className="qz-hint">
              Nossa consultoria é voltada para empresas em operação que buscam
              otimizar processos e escalar com controle. No momento, não conseguimos
              oferecer o melhor atendimento para seu perfil.
            </p>
            <p className="qz-hint" style={{ marginTop: 8 }}>
              Quando sua empresa estiver ativa, estaremos prontos para ajudar.
            </p>
            <button className="qz-btn-sec" onClick={() => setStep("q1_has_company")}>
              Voltar ao início
            </button>
          </div>
        )}

        {/* Q1b — Cargo */}
        {step === "q1b_role" && (
          <div className="qz-step">
            <div className="qz-counter">02 / 07</div>
            <h3 className="qz-question">Qual seu cargo?</h3>
            <div className="qz-options-col">
              {ROLE_OPTIONS.map((role) => (
                <button key={role} className="qz-opt-revenue" onClick={() => handleRole(role)}>
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q2 — Nome da empresa */}
        {step === "q2_company_name" && (
          <div className="qz-step">
            <div className="qz-counter">03 / 07</div>
            <h3 className="qz-question">Nome da empresa</h3>
            <input
              ref={inputRef}
              className="qz-input"
              type="text"
              placeholder="Ex: Acme Indústrias"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleTextNext("companyName", "q3_revenue")}
            />
            {error && <p className="qz-error">{error}</p>}
            <button className="qz-btn-primary" onClick={() => handleTextNext("companyName", "q3_revenue")}>
              Continuar
            </button>
          </div>
        )}

        {/* Q3 — Faturamento */}
        {step === "q3_revenue" && (
          <div className="qz-step">
            <div className="qz-counter">04 / 07</div>
            <h3 className="qz-question">Faturamento mensal</h3>
            <div className="qz-options-col">
              {REVENUE_OPTIONS.map((opt) => (
                <button key={opt.value} className="qz-opt-revenue" onClick={() => handleRevenue(opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q4 — Nome */}
        {step === "q4_contact_name" && (
          <div className="qz-step">
            <div className="qz-counter">05 / 07</div>
            <h3 className="qz-question">Seu nome</h3>
            <input
              ref={inputRef}
              className="qz-input"
              type="text"
              placeholder="Nome completo"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleTextNext("contactName", "q5_email")}
            />
            {error && <p className="qz-error">{error}</p>}
            <button className="qz-btn-primary" onClick={() => handleTextNext("contactName", "q5_email")}>
              Continuar
            </button>
          </div>
        )}

        {/* Q5 — Email */}
        {step === "q5_email" && (
          <div className="qz-step">
            <div className="qz-counter">06 / 07</div>
            <h3 className="qz-question">Seu e-mail</h3>
            <input
              ref={inputRef}
              className="qz-input"
              type="email"
              placeholder="voce@empresa.com.br"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleTextNext("email", "q6_phone")}
            />
            {error && <p className="qz-error">{error}</p>}
            <button className="qz-btn-primary" onClick={() => handleTextNext("email", "q6_phone")}>
              Continuar
            </button>
          </div>
        )}

        {/* Q6 — Telefone */}
        {step === "q6_phone" && (
          <div className="qz-step">
            <div className="qz-counter">07 / 07</div>
            <h3 className="qz-question">WhatsApp com DDD</h3>
            <input
              ref={inputRef}
              className="qz-input"
              type="tel"
              placeholder="(48) 99999-9999"
              value={inputValue}
              maxLength={15}
              onChange={(e) => { setInputValue(formatPhone(e.target.value)); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handlePhoneNext()}
            />
            {error && <p className="qz-error">{error}</p>}
            <button className="qz-btn-primary" onClick={handlePhoneNext} disabled={loading}>
              {loading ? "Enviando..." : "Solicitar diagnóstico gratuito"}
            </button>
          </div>
        )}

        {/* Sucesso */}
        {step === "success" && (
          <div className="qz-step">
            <div className="qz-success-mark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="#b01414" strokeWidth="1"/>
                <path d="M7 12l3.5 3.5L17 8" stroke="#b01414" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="qz-question">Informações recebidas.</h3>
            <p className="qz-hint">
              Nossa equipe entrará em contato em breve para dar início ao seu diagnóstico.
            </p>
            <div className="qz-summary">
              <div className="qz-summary-row">
                <span className="qz-summary-key">Empresa</span>
                <span className="qz-summary-val">{formData.companyName}</span>
              </div>
              <div className="qz-summary-row">
                <span className="qz-summary-key">E-mail</span>
                <span className="qz-summary-val">{formData.email}</span>
              </div>
            </div>
            <a
              href={`${WHATSAPP_URL}?text=Ol%C3%A1%2C%20preenchi%20o%20formul%C3%A1rio%20da%20EJEP%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.`}
              target="_blank"
              rel="noopener noreferrer"
              className="qz-whatsapp"
            >
              Falar pelo WhatsApp
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .qz-wrap { width: 100%; }

        .qz-progress {
          height: 2px;
          background: rgba(255,255,255,0.1);
          overflow: hidden;
        }
        .qz-progress-fill {
          height: 100%;
          background: #b01414;
          transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        .qz-card {
          background: #ffffff;
          border: 1px solid rgba(176,20,20,0.2);
          border-top: 3px solid #b01414;
          padding: 36px 32px 32px;
          position: relative;
          animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        @media (max-width: 500px) { .qz-card { padding: 28px 20px; } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .qz-back {
          position: absolute;
          top: 12px; left: 14px;
          background: none; border: none;
          color: #9a7070;
          font-size: 11px;
          font-family: var(--font-body), sans-serif;
          letter-spacing: 0.06em;
          cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          padding: 4px;
          transition: color 0.15s;
        }
        .qz-back:hover { color: #b01414; }

        .qz-step { display: flex; flex-direction: column; gap: 18px; }

        .qz-counter {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: #b01414;
          font-weight: 500;
        }

        .qz-question {
          font-family: var(--font-display), serif;
          font-size: 21px;
          font-weight: 600;
          color: #1a0505;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        @media (max-width: 500px) { .qz-question { font-size: 18px; } }

        .qz-hint {
          font-size: 14px;
          color: #5c4040;
          line-height: 1.65;
          font-family: var(--font-body), sans-serif;
          font-weight: 400;
        }

        .qz-options-col { display: flex; flex-direction: column; gap: 8px; }

        .qz-opt-primary {
          padding: 15px 20px;
          background: #400505;
          color: #ffffff;
          border: 1px solid #400505;
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .qz-opt-primary:hover { background: #5c0a0a; border-color: #5c0a0a; }

        .qz-opt-ghost {
          padding: 15px 20px;
          background: #ffffff;
          color: #400505;
          border: 1px solid rgba(64,5,5,0.2);
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s;
        }
        .qz-opt-ghost:hover { border-color: #400505; }

        .qz-opt-revenue {
          padding: 13px 20px;
          background: #ffffff;
          color: #1a0505;
          border: 1px solid rgba(64,5,5,0.15);
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
        }
        .qz-opt-revenue:hover {
          border-color: #b01414;
          color: #b01414;
          background: #fdf8f8;
        }

        .qz-input {
          width: 100%;
          padding: 13px 16px;
          background: #ffffff;
          border: 1px solid rgba(64,5,5,0.2);
          color: #1a0505;
          font-family: var(--font-body), sans-serif;
          font-size: 15px;
          font-weight: 400;
          outline: none;
          transition: border-color 0.15s;
          border-radius: 0;
          -webkit-appearance: none;
        }
        .qz-input::placeholder { color: #b09090; }
        .qz-input:focus { border-color: #b01414; }

        .qz-error {
          color: #b01414;
          font-size: 12px;
          font-family: var(--font-body), sans-serif;
          letter-spacing: 0.03em;
          margin-top: -6px;
        }

        .qz-btn-primary {
          background: #400505;
          color: #ffffff;
          border: none;
          padding: 15px 28px;
          font-family: var(--font-body), sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.15s;
          text-align: center;
        }
        .qz-btn-primary:hover:not(:disabled) { background: #5c0a0a; }
        .qz-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .qz-btn-sec {
          background: transparent;
          color: #7a5050;
          border: 1px solid rgba(64,5,5,0.15);
          padding: 13px 24px;
          font-family: var(--font-body), sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .qz-btn-sec:hover { color: #400505; border-color: #400505; }

        .qz-success-mark {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(176,20,20,0.3);
        }

        .qz-summary {
          border: 1px solid rgba(64,5,5,0.1);
          background: #fdf8f8;
          padding: 14px 18px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .qz-summary-row { display: flex; justify-content: space-between; gap: 16px; }
        .qz-summary-key {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9a7070;
          font-family: var(--font-mono), monospace;
          flex-shrink: 0;
        }
        .qz-summary-val {
          font-size: 13px;
          color: #1a0505;
          font-weight: 500;
          font-family: var(--font-body), sans-serif;
          text-align: right;
        }

        .qz-whatsapp {
          display: block;
          text-align: center;
          background: #25D366;
          color: #ffffff;
          border: none;
          padding: 14px 24px;
          font-family: var(--font-body), sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-decoration: none;
          transition: background 0.15s;
        }
        .qz-whatsapp:hover { background: #20ba56; }
      `}</style>
    </div>
  );
}
