import Image from "next/image";
import Quiz from "@/components/Quiz";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <Image
            src="/EJEP%20TRUE%20LOGO.png"
            alt="EJEP"
            width={160}
            height={64}
            className="logo-img"
            priority
          />
          <a href="#sobre" className="header-cta">Como funciona</a>
        </div>
      </header>

      {/* HERO */}
      <section id="quiz" className="hero">
        <div className="hero-grid">

          {/* Esquerda */}
          <div>

            <h1 className="hero-headline anim-2">
              Sua empresa cresce,<br />
              mas os processos<br />
              <em>não acompanham?</em>
            </h1>

            <p className="hero-sub anim-3">
              Mapeamos, documentamos e otimizamos suas operações para que
              você pare de apagar incêndios e comece a escalar com controle.
            </p>

            <div className="hero-metrics anim-4">
              <div className="metric">
                <div className="metric-value">450+</div>
                <div className="metric-label">Projetos entregues</div>
              </div>
              <div className="metric">
                <div className="metric-value">NPS 90</div>
                <div className="metric-label">Satisfação</div>
              </div>
              <div className="metric">
                <div className="metric-value">4 a 8 sem.</div>
                <div className="metric-label">Prazo médio</div>
              </div>
            </div>
          </div>

          {/* Direita — Quiz */}
          <div className="quiz-panel anim-3">
            <div className="quiz-intro-header">
              <span className="quiz-intro-label">Diagnóstico gratuito</span>
            </div>
            <p className="quiz-intro-title">
              Descubra o que está<br />travando sua empresa.
            </p>
            <p className="quiz-intro-sub">
              Responda 7 perguntas rápidas e nossa equipe entra em contato
              com um diagnóstico personalizado, sem compromisso.
            </p>
            <div className="quiz-start-cue">
              <span className="quiz-start-arrow">↓</span>
              <span className="quiz-start-text">Comece respondendo abaixo</span>
            </div>
            <Quiz />
          </div>

        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="about">
        <div className="container">
          <div className="about-header">
            <div>
              <div className="about-eyebrow">Como funciona</div>
              <h2 className="about-headline">
                Entenda como a EJEP<br />
                <em>transforma sua operação</em>
              </h2>
            </div>
            <p className="about-desc">
              Nosso projeto é desenhado para ser simples, estruturado e transparente.
              A cada etapa, entregamos valor real para sua empresa.
            </p>
          </div>

          <div className="steps-grid">
            {[
              {
                num: "01",
                title: "Diagnóstico",
                desc: "Entendemos onde estão os gargalos que travam o crescimento da sua operação.",
              },
              {
                num: "02",
                title: "Mapeamento e Padronização",
                desc: "Criamos fluxogramas, padrões e rotinas otimizadas que facilitam o dia a dia e reduzem retrabalho.",
              },
              {
                num: "03",
                title: "Plano de Ação",
                desc: "Montamos um roadmap estratégico com foco em eficiência, organização e crescimento sustentável.",
              },
              {
                num: "04",
                title: "Acompanhamento dos resultados",
                desc: "Monitoramos os indicadores e ajustamos o necessário para garantir a melhoria contínua.",
              },
            ].map((s) => (
              <div key={s.num} className="step-card">
                <span className="step-num">{s.num}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                <span className="step-ghost" aria-hidden="true">{s.num}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-strip">
        <div className="cta-inner">
          <h2 className="cta-headline">
            Pronto para escalar com<br />
            <em>clareza e controle?</em>
          </h2>
          <a href="#quiz" className="btn-primary">
            Solicitar diagnóstico
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <Image
            src="/EJEP%20TRUE%20LOGO.png"
            alt="EJEP"
            width={80}
            height={36}
            style={{ height: "52px", width: "auto", filter: "brightness(0) invert(1)" }}
          />
          <p className="footer-meta">© 2026 EJEP. Todos os direitos reservados.</p>
          <p className="footer-address">UFSC · Trindade, Florianópolis · SC</p>
        </div>
      </footer>

      <WhatsAppButton />
    </>
  );
}
