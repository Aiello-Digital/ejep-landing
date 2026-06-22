"use client";

import { WHATSAPP_URL } from "@/lib/constants";

export default function WhatsAppButton() {
  return (
    <>
      <a
        href={`${WHATSAPP_URL}?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20EJEP.`}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
        aria-label="WhatsApp EJEP"
      >
        <svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 1.375C5.685 1.375 1.375 5.685 1.375 11c0 1.698.45 3.29 1.24 4.664L1.375 20.625l5.13-1.22A9.584 9.584 0 0011 20.625c5.315 0 9.625-4.31 9.625-9.625S16.315 1.375 11 1.375z" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M15.8 13.65c-.275-.138-1.62-.8-1.87-.892-.25-.09-.43-.137-.61.138-.18.275-.7.891-.858 1.073-.159.18-.317.203-.592.068-.275-.137-1.16-.427-2.21-1.363-.817-.728-1.37-1.627-1.53-1.902-.16-.275-.017-.424.12-.56.124-.123.275-.32.413-.48.137-.16.183-.275.275-.458.09-.183.046-.343-.023-.48-.068-.137-.61-1.474-.836-2.018-.22-.53-.444-.458-.61-.467-.158-.007-.34-.01-.52-.01-.183 0-.48.068-.73.343-.25.275-.958.937-.958 2.284s.98 2.65 1.118 2.832c.137.183 1.929 2.947 4.675 4.132.653.282 1.162.45 1.56.577.656.208 1.253.179 1.725.109.526-.079 1.62-.662 1.849-1.302.229-.64.229-1.19.16-1.303-.068-.114-.25-.182-.524-.32z" fill="currentColor"/>
        </svg>
        <span className="wa-label">WhatsApp</span>
      </a>

      <style jsx>{`
        .wa-btn {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #25D366;
          color: #ffffff;
          padding: 12px 22px 12px 18px;
          text-decoration: none;
          font-family: var(--font-body), sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 9999px;
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .wa-btn:hover {
          background: #20ba56;
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.5);
        }
        .wa-btn:active {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.45);
        }
        .wa-label {
          display: block;
        }
        @media (max-width: 600px) {
          .wa-label {
            display: none;
          }
          .wa-btn {
            padding: 0;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            bottom: 24px;
            right: 24px;
            box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
          }
          .wa-btn:hover {
            transform: scale(1.05) translateY(-2px);
          }
        }
      `}</style>
    </>
  );
}
