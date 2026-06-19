import Quiz from "@/components/Quiz";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      {/* ─────────────── DOBRA 1: HERO + QUIZ ─────────────── */}
      <section id="quiz" className="hero-section">
        <div className="hero-container">
          {/* Left — headline */}
          <div className="hero-left">
            <div className="hero-badge">Diagnóstico Gratuito</div>
            <h1 className="hero-headline">
              Sua empresa fatura, mas o{" "}
              <span className="highlight">lucro some</span> no meio do caminho?
            </h1>
            <p className="hero-sub">
              Se você sente que trabalha cada vez mais e os resultados não acompanham —
              processos desorganizados podem ser o freio invisível do seu crescimento.
            </p>
            <p className="hero-sub">
              <strong>Descubra em minutos</strong> o que está travando sua operação
              e receba um diagnóstico personalizado da EJEP.
            </p>

            <div className="hero-trust">
              <div className="trust-item">
                <span className="trust-number">450+</span>
                <span className="trust-label">Projetos entregues</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <span className="trust-number">NPS 90</span>
                <span className="trust-label">Satisfação dos clientes</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <span className="trust-number">100%</span>
                <span className="trust-label">Foco em resultados</span>
              </div>
            </div>
          </div>

          {/* Right — quiz */}
          <div className="hero-right">
            <p className="quiz-intro">
              🚀 Leva menos de 2 minutos — responda e receba seu diagnóstico gratuito
            </p>
            <Quiz />
          </div>
        </div>
      </section>

      {/* ─────────────── DOBRA 2: SOBRE A EJEP ─────────────── */}
      <section id="sobre" className="about-section">
        <div className="about-container">
          {/* Header */}
          <div className="about-header">
            <span className="section-badge">Quem somos</span>
            <h2 className="about-headline">
              A EJEP transforma caos operacional em{" "}
              <span className="highlight">crescimento sustentável</span>
            </h2>
            <p className="about-sub">
              Somos uma empresa júnior de engenharia de produção da UFSC, especializada em
              mapear, documentar e otimizar os processos das empresas que querem escalar
              sem perder o controle.
            </p>
          </div>

          {/* 4-step process */}
          <div className="process-grid">
            {[
              {
                num: "01",
                title: "Diagnóstico",
                desc: "Identificamos os gargalos que estão travando sua operação e impedindo o crescimento que você merece.",
              },
              {
                num: "02",
                title: "Mapeamento e Padronização",
                desc: "Criamos fluxogramas, padrões e rotinas que reduzem retrabalho e facilitam o dia a dia da sua equipe.",
              },
              {
                num: "03",
                title: "Plano de Ação",
                desc: "Entregamos um roadmap estratégico com foco em eficiência, organização e crescimento com controle.",
              },
              {
                num: "04",
                title: "Acompanhamento",
                desc: "Monitoramos os indicadores e ajustamos o necessário para garantir melhoria contínua e resultados reais.",
              },
            ].map((step) => (
              <div key={step.num} className="process-card">
                <span className="process-num">{step.num}</span>
                <h3 className="process-title">{step.title}</h3>
                <p className="process-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Logos */}
          <div className="logos-section">
            <p className="logos-label">Empresas que já confiam na EJEP</p>
            <div className="logos-row">
              {["UFSC", "Tigre", "GELOG", "Produttare", "NEU"].map((logo) => (
                <div key={logo} className="logo-chip">{logo}</div>
              ))}
            </div>
          </div>

          {/* Case highlights */}
          <div className="cases-grid">
            <div className="case-card">
              <div className="case-tag">Bioenergia</div>
              <h4 className="case-title">Belem Bioenergia</h4>
              <p className="case-desc">
                Sem clareza nas funções e sem padronização. Após o projeto: visão ampla dos
                processos, estrutura setorial clara e onboarding estruturado.
              </p>
            </div>
            <div className="case-card">
              <div className="case-tag">Varejo</div>
              <h4 className="case-title">Sá Telas</h4>
              <p className="case-desc">
                Crescimento com excesso de centralização entre lojas e fábrica. Resultado:
                ambiente organizado, líderes liberados para decisões estratégicas.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="about-cta">
            <h3 className="cta-headline">
              Pronto para parar de apagar incêndios e começar a crescer com estratégia?
            </h3>
            <a href="#quiz" className="cta-btn">
              Quero meu diagnóstico gratuito →
            </a>
            <p className="cta-fine">Sem compromisso. Resultado em até 24h úteis.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p className="footer-brand">EJEP</p>
          <p className="footer-address">
            Roberto Sampaio Gonzaga, UFSC – Trindade, Florianópolis – SC
          </p>
          <p className="footer-copy">© 2025 EJEP. Todos os direitos reservados.</p>
        </div>
      </footer>

      <WhatsAppButton />
    </>
  );
}
