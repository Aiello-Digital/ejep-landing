"use client";

export default function WhatsAppButton() {
  return (
    <>
      <a
        href="https://wa.me/5548985020217?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20EJEP!"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        aria-label="Falar no WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 1.75C7.235 1.75 1.75 7.235 1.75 14c0 2.17.577 4.203 1.582 5.957L1.75 26.25l4.48-1.54A12.19 12.19 0 0014 26.25c6.765 0 12.25-5.485 12.25-12.25S20.765 1.75 14 1.75z" fill="white"/>
          <path d="M20.125 17.367c-.35-.175-2.065-1.018-2.38-1.136-.317-.117-.547-.175-.778.175-.231.35-.894 1.136-1.096 1.367-.202.231-.403.26-.753.087-.35-.175-1.477-.544-2.813-1.735-1.04-.926-1.743-2.069-1.947-2.419-.203-.35-.021-.54.153-.713.157-.157.35-.408.525-.612.175-.204.233-.35.35-.584.117-.233.058-.437-.03-.612-.087-.175-.777-1.876-1.065-2.567-.28-.674-.565-.583-.778-.594-.201-.01-.432-.013-.663-.013-.231 0-.612.087-.932.437-.32.35-1.225 1.197-1.225 2.917 0 1.72 1.254 3.383 1.429 3.617.175.233 2.468 3.767 5.981 5.28.836.361 1.488.577 1.996.738.839.267 1.603.23 2.207.14.673-.1 2.065-.844 2.357-1.659.292-.816.292-1.515.204-1.66-.087-.146-.317-.233-.667-.408z" fill="#25D366"/>
        </svg>
        <span className="wa-tooltip">Fale conosco</span>
      </a>

      <style jsx>{`
        .wa-float {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 60px;
          height: 60px;
          background: #25D366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          z-index: 1000;
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }
        .wa-float:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 28px rgba(37, 211, 102, 0.5);
        }
        .wa-tooltip {
          position: absolute;
          right: 70px;
          background: #101828;
          color: white;
          font-size: 13px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
          font-family: inherit;
        }
        .wa-float:hover .wa-tooltip { opacity: 1; }
        @media (max-width: 600px) {
          .wa-float { bottom: 20px; right: 20px; width: 54px; height: 54px; }
        }
      `}</style>
    </>
  );
}
