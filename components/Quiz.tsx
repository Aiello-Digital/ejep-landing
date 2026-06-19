"use client";

import { useState, useEffect } from "react";

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
  { value: "ate_50k", label: "Até R$ 50.000" },
  { value: "50k_200k", label: "R$ 50.000 – R$ 200.000" },
  { value: "200k_500k", label: "R$ 200.000 – R$ 500.000" },
  { value: "acima_500k", label: "Acima de R$ 500.000" },
];

const ZAPIER_WEBHOOK = process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL || "";

function getUtmParams(): Partial<FormData> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
  };
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

export default function Quiz() {
  const [step, setStep] = useState<Step>("q1_has_company");
  const [formData, setFormData] = useState<FormData>({
    hasCompany: "",
    companyName: "",
    revenue: "",
    contactName: "",
    email: "",
    phone: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const utms = getUtmParams();
    setFormData((prev) => ({ ...prev, ...utms }));
  }, []);

  function goBack() {
    const currentIdx = STEP_ORDER.indexOf(step);
    if (currentIdx > 0) {
      setStep(STEP_ORDER[currentIdx - 1]);
      setError("");
      setInputValue("");
    }
  }

  function handleYesNo(value: "sim" | "nao") {
    if (value === "nao") {
      setFormData((prev) => ({ ...prev, hasCompany: "nao" }));
      setStep("q1_disqualified");
    } else {
      setFormData((prev) => ({ ...prev, hasCompany: "sim" }));
      setStep("q2_company_name");
    }
  }

  function handleRevenue(value: string) {
    setFormData((prev) => ({ ...prev, revenue: value }));
    setStep("q4_contact_name");
  }

  function handleTextNext(field: keyof FormData, nextStep: Step) {
    if (!inputValue.trim()) {
      setError("Este campo é obrigatório.");
      return;
    }
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
      setError("Informe um e-mail válido.");
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: inputValue.trim() }));
    setInputValue("");
    setError("");
    setStep(nextStep);
  }

  async function handlePhoneNext() {
    if (!inputValue.trim()) {
      setError("Este campo é obrigatório.");
      return;
    }
    const phoneClean = inputValue.replace(/\D/g, "");
    if (phoneClean.length < 10) {
      setError("Informe um telefone válido com DDD.");
      return;
    }
    const finalData = { ...formData, phone: inputValue.trim() };
    setFormData(finalData);
    setError("");
    setLoading(true);

    try {
      if (ZAPIER_WEBHOOK) {
        await fetch(ZAPIER_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            empresa: finalData.companyName,
            faturamento: finalData.revenue,
            nome: finalData.contactName,
            email: finalData.email,
            telefone: finalData.phone,
            utm_source: finalData.utm_source,
            utm_medium: finalData.utm_medium,
            utm_campaign: finalData.utm_campaign,
            utm_term: finalData.utm_term,
            data: new Date().toISOString(),
          }),
        });
      }
    } catch {
      // silently continue
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

  return (
    <div className="quiz-wrapper">
      {/* Progress bar */}
      {step !== "q1_disqualified" && step !== "success" && (
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="quiz-card animate-fade-in-up" key={step}>
        {/* Back button */}
        {showBack && (
          <button className="back-btn" onClick={goBack} type="button">
            ← Voltar
          </button>
        )}

        {/* Q1 */}
        {step === "q1_has_company" && (
          <div className="quiz-step">
            <span className="step-label">Pergunta 1 de 6</span>
            <h2 className="quiz-question">
              Você possui uma empresa ativa no momento?
            </h2>
            <p className="quiz-sub">Isso nos ajuda a entender como podemos te ajudar da melhor forma.</p>
            <div className="option-row">
              <button className="option-btn primary" onClick={() => handleYesNo("sim")}>
                ✓ Sim, tenho uma empresa
              </button>
              <button className="option-btn secondary" onClick={() => handleYesNo("nao")}>
                Não, ainda não
              </button>
            </div>
          </div>
        )}

        {/* Disqualified */}
        {step === "q1_disqualified" && (
          <div className="quiz-step text-center">
            <div className="disqualified-icon">🙏</div>
            <h2 className="quiz-question">Obrigado pelo seu interesse!</h2>
            <p className="quiz-sub">
              Nossa consultoria é focada em empresas que já estão operando e buscam otimizar seus processos e escalar com mais controle.{" "}
              <strong>No momento, não conseguiremos te atender da melhor forma.</strong>
            </p>
            <p className="quiz-sub" style={{ marginTop: "12px" }}>
              Mas não desanime — quando você tiver sua empresa rodando, estaremos prontos para te ajudar a crescer com estratégia.
            </p>
            <button
              className="btn-primary"
              style={{ marginTop: "24px" }}
              onClick={() => setStep("q1_has_company")}
            >
              Recomeçar
            </button>
          </div>
        )}

        {/* Q2 */}
        {step === "q2_company_name" && (
          <div className="quiz-step">
            <span className="step-label">Pergunta 2 de 6</span>
            <h2 className="quiz-question">Qual é o nome da sua empresa?</h2>
            <input
              className="quiz-input"
              type="text"
              placeholder="Ex: Tech Solutions Ltda"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleTextNext("companyName", "q3_revenue")}
              autoFocus
            />
            {error && <p className="error-msg">{error}</p>}
            <button
              className="btn-primary"
              onClick={() => handleTextNext("companyName", "q3_revenue")}
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Q3 */}
        {step === "q3_revenue" && (
          <div className="quiz-step">
            <span className="step-label">Pergunta 3 de 6</span>
            <h2 className="quiz-question">
              Qual é o faturamento mensal aproximado da{" "}
              {formData.companyName || "sua empresa"}?
            </h2>
            <p className="quiz-sub">Selecione a faixa que melhor representa sua realidade atual.</p>
            <div className="revenue-options">
              {REVENUE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className="revenue-btn"
                  onClick={() => handleRevenue(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q4 */}
        {step === "q4_contact_name" && (
          <div className="quiz-step">
            <span className="step-label">Pergunta 4 de 6</span>
            <h2 className="quiz-question">Qual é o seu nome?</h2>
            <input
              className="quiz-input"
              type="text"
              placeholder="Seu nome completo"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleTextNext("contactName", "q5_email")}
              autoFocus
            />
            {error && <p className="error-msg">{error}</p>}
            <button
              className="btn-primary"
              onClick={() => handleTextNext("contactName", "q5_email")}
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Q5 */}
        {step === "q5_email" && (
          <div className="quiz-step">
            <span className="step-label">Pergunta 5 de 6</span>
            <h2 className="quiz-question">Qual é o seu melhor e-mail?</h2>
            <p className="quiz-sub">Enviaremos o resultado do seu diagnóstico por aqui.</p>
            <input
              className="quiz-input"
              type="email"
              placeholder="voce@suaempresa.com.br"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleTextNext("email", "q6_phone")}
              autoFocus
            />
            {error && <p className="error-msg">{error}</p>}
            <button
              className="btn-primary"
              onClick={() => handleTextNext("email", "q6_phone")}
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Q6 */}
        {step === "q6_phone" && (
          <div className="quiz-step">
            <span className="step-label">Pergunta 6 de 6</span>
            <h2 className="quiz-question">Qual é o seu WhatsApp?</h2>
            <p className="quiz-sub">Nosso time entrará em contato para agendar seu diagnóstico gratuito.</p>
            <input
              className="quiz-input"
              type="tel"
              placeholder="(48) 9 9999-9999"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handlePhoneNext()}
              autoFocus
            />
            {error && <p className="error-msg">{error}</p>}
            <button
              className="btn-primary"
              onClick={handlePhoneNext}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Quero meu diagnóstico gratuito →"}
            </button>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="quiz-step text-center">
            <div className="success-icon">🎯</div>
            <h2 className="quiz-question">
              Perfeito, {formData.contactName}!
            </h2>
            <p className="quiz-sub">
              Recebemos suas informações. Nossa equipe entrará em contato em{" "}
              <strong>até 24 horas úteis</strong> para agendar seu diagnóstico gratuito.
            </p>
            <div className="success-highlight">
              <p>📋 Empresa: <strong>{formData.companyName}</strong></p>
              <p>📧 E-mail: <strong>{formData.email}</strong></p>
            </div>
            <a
              href={`https://wa.me/5548985020217?text=Ol%C3%A1%2C%20acabei%20de%20preencher%20o%20formul%C3%A1rio%20da%20EJEP%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20diagn%C3%B3stico%20gratuito.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ marginTop: "24px", display: "inline-block" }}
            >
              💬 Falar agora no WhatsApp
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .quiz-wrapper {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        .progress-bar-container {
          width: 100%;
          height: 4px;
          background: #E0E0E0;
          border-radius: 2px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: #ED1515;
          border-radius: 2px;
          transition: width 0.4s ease;
        }
        .quiz-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          position: relative;
        }
        @media (max-width: 600px) {
          .quiz-card { padding: 24px 20px; }
        }
        .back-btn {
          position: absolute;
          top: 16px;
          left: 20px;
          background: none;
          border: none;
          color: #667085;
          font-size: 14px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .back-btn:hover { color: #101828; }
        .quiz-step { display: flex; flex-direction: column; gap: 16px; }
        .step-label {
          font-size: 13px;
          font-weight: 600;
          color: #ED1515;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .quiz-question {
          font-size: 22px;
          font-weight: 700;
          color: #101828;
          line-height: 1.3;
          margin: 0;
        }
        @media (max-width: 600px) {
          .quiz-question { font-size: 18px; }
        }
        .quiz-sub {
          font-size: 15px;
          color: #667085;
          margin: 0;
          line-height: 1.5;
        }
        .option-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }
        .option-btn {
          padding: 16px 24px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
          text-align: center;
        }
        .option-btn.primary {
          background: #ED1515;
          color: white;
          border-color: #ED1515;
        }
        .option-btn.primary:hover { background: #C00D0D; border-color: #C00D0D; }
        .option-btn.secondary {
          background: white;
          color: #344054;
          border-color: #D0D5DD;
        }
        .option-btn.secondary:hover { border-color: #101828; color: #101828; }
        .quiz-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #D0D5DD;
          border-radius: 10px;
          font-size: 16px;
          color: #101828;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .quiz-input:focus { border-color: #ED1515; }
        .revenue-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .revenue-btn {
          padding: 14px 20px;
          border: 2px solid #D0D5DD;
          border-radius: 10px;
          background: white;
          color: #344054;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          font-family: inherit;
        }
        .revenue-btn:hover {
          border-color: #ED1515;
          color: #ED1515;
          background: #FFF5F5;
        }
        .btn-primary {
          background: #ED1515;
          color: white;
          border: none;
          padding: 15px 28px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          font-family: inherit;
          margin-top: 4px;
        }
        .btn-primary:hover:not(:disabled) { background: #C00D0D; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .error-msg { color: #ED1515; font-size: 13px; margin: -4px 0 0; }
        .disqualified-icon, .success-icon {
          font-size: 48px;
          text-align: center;
        }
        .text-center { text-align: center; align-items: center; }
        .success-highlight {
          background: #F2F4F7;
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 15px;
          color: #344054;
          text-align: left;
          width: 100%;
        }
        .btn-whatsapp {
          background: #25D366;
          color: white;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-whatsapp:hover { background: #1ebe5a; }
      `}</style>
    </div>
  );
}
