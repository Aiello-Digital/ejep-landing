"use client";

import { useState, useEffect, useRef } from "react";
import { WHATSAPP_URL } from "@/lib/constants";

type Step =
  | "q1_has_company"
  | "q1_disqualified"
  | "q2_company_name"
  | "q3_revenue"
  | "q4_contact_name"
  | "q5_email"
  | "q6_phone"
  | "success";

interface FormData {
  hasCompany: string;
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
    hasCompany: "", companyName: "", revenue: "",
    contactName: "", email: "", phone: "",
    utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData((p) => ({ ...p, ...getUtmParams() }));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [step]);

  const STEP_FIELD: Partial<Record<Step, keyof FormData>> = {
    q2_company_name:  "companyName",
    q4_contact_name:  "contactName",
    q5_email:         "email",
    q6_phone:         "phone",
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
      setStep("q2_company_name");
    }
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
      {/* Progress */}
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

        {/* Q1 */}
        {step === "q1_has_company" && (
          <div className="qz-step">
            <div className="qz-counter">01 / 06</div>
            <h3 className="qz-question">Você possui uma empresa?</h3>
            <div className="qz-options-col">
              <button className="qz-opt-primary" onClick={() => handleYesNo("sim")}>Sim</button>
              <button className="qz-opt-ghost"   onClick={() => handleYesNo("nao")}>Não</button>
            </div>
          </div>
        )}

        {/* Disqualified */}
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

        {/* Q2 */}
        {step === "q2_company_name" && (
          <div className="qz-step">
            <div className="qz-counter">02 / 06</div>
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

        {/* Q3 */}
        {step === "q3_revenue" && (
          <div className="qz-step">
            <div className="qz-counter">03 / 06</div>
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

        {/* Q4 */}
        {step === "q4_contact_name" && (
          <div className="qz-step">
            <div className="qz-counter">04 / 06</div>
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

        {/* Q5 */}
        {step === "q5_email" && (
          <div className="qz-step">
            <div className="qz-counter">05 / 06</div>
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

        {/* Q6 */}
        {step === "q6_phone" && (
          <div className="qz-step">
            <div className="qz-counter">06 / 06</div>
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

        {/* Success */}
        {step === "success" && (
          <div className="qz-step">
            <div className="qz-success-mark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="#c01818" strokeWidth="1"/>
                <path d="M7 12l3.5 3.5L17 8" stroke="#c01818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin-bottom: 20px;
          overflow: hidden;
        }
        .qz-progress-fill {
          height: 100%;
          background: #c01818;
          transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        .qz-card {
          background: #0f030a;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 40px 36px;
          position: relative;
          animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        @media (max-width: 500px) { .qz-card { padding: 28px 20px; } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .qz-back {
          position: absolute;
          top: 14px; left: 16px;
          background: none; border: none;
          color: #9a7070;
          font-size: 12px;
          font-family: var(--font-body), sans-serif;
          letter-spacing: 0.06em;
          cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          padding: 4px;
          transition: color 0.15s;
        }
        .qz-back:hover { color: #9a7878; }

        .qz-step { display: flex; flex-direction: column; gap: 20px; }

        .qz-counter {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: #9a6060;
        }

        .qz-question {
          font-family: var(--font-display), serif;
          font-size: 22px;
          font-weight: 500;
          color: #f0e6e6;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        @media (max-width: 500px) { .qz-question { font-size: 19px; } }

        .qz-hint {
          font-size: 14px;
          color: #b09090;
          line-height: 1.65;
          font-family: var(--font-body), sans-serif;
          font-weight: 300;
        }

        .qz-options-col { display: flex; flex-direction: column; gap: 8px; }

        .qz-opt-primary {
          padding: 16px 20px;
          background: #400505;
          color: #f0e6e6;
          border: 1px solid #5c0a0a;
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.04em;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .qz-opt-primary:hover { background: #5c0a0a; }

        .qz-opt-ghost {
          padding: 16px 20px;
          background: transparent;
          color: #c4a4a4;
          border: 1px solid rgba(255,255,255,0.07);
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s, color 0.15s;
        }
        .qz-opt-ghost:hover { border-color: rgba(255,255,255,0.16); color: #f0e6e6; }

        .qz-opt-revenue {
          padding: 15px 20px;
          background: transparent;
          color: #c4a4a4;
          border: 1px solid rgba(255,255,255,0.07);
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
        }
        .qz-opt-revenue:hover {
          border-color: #c01818;
          color: #f0e6e6;
          background: rgba(192,24,24,0.06);
        }

        .qz-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f0e6e6;
          font-family: var(--font-body), sans-serif;
          font-size: 15px;
          font-weight: 300;
          outline: none;
          transition: border-color 0.15s;
          border-radius: 0;
          -webkit-appearance: none;
        }
        .qz-input::placeholder { color: #7a5858; }
        .qz-input:focus { border-color: rgba(192,24,24,0.5); }

        .qz-error {
          color: #c01818;
          font-size: 12px;
          font-family: var(--font-body), sans-serif;
          letter-spacing: 0.03em;
          margin-top: -8px;
        }

        .qz-btn-primary {
          background: #400505;
          color: #f0e6e6;
          border: none;
          padding: 16px 28px;
          font-family: var(--font-body), sans-serif;
          font-size: 13px;
          font-weight: 500;
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
          color: #b09090;
          border: 1px solid rgba(255,255,255,0.07);
          padding: 14px 24px;
          font-family: var(--font-body), sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .qz-btn-sec:hover { color: #f0e6e6; border-color: rgba(255,255,255,0.16); }

        .qz-success-mark {
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(192,24,24,0.3);
        }

        .qz-summary {
          border: 1px solid rgba(255,255,255,0.06);
          padding: 16px 20px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .qz-summary-row { display: flex; justify-content: space-between; gap: 16px; }
        .qz-summary-key {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8a6060;
          font-family: var(--font-mono), monospace;
          flex-shrink: 0;
        }
        .qz-summary-val {
          font-size: 13px;
          color: #c4a4a4;
          font-family: var(--font-body), sans-serif;
          text-align: right;
        }

        .qz-whatsapp {
          display: block;
          text-align: center;
          background: transparent;
          color: #c4a4a4;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 14px 24px;
          font-family: var(--font-body), sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-decoration: none;
          transition: color 0.15s, border-color 0.15s;
        }
        .qz-whatsapp:hover { color: #f0e6e6; border-color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
