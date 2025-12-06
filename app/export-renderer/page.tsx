"use client";

import { useEffect } from "react";
import html2canvas from "html2canvas";

export default function ExportRenderer() {
  
  useEffect(() => {
    const run = async () => {
      // Wait for opener to send HTML + format
      const payload = (window as any).exportData;
      if (!payload) return;

      const { htmlContent, format } = payload;

      // Inject resume HTML
      document.body.innerHTML = `
      <style>
        body {
          margin: 0;
          padding: 0;
          background: white;
        }
        #export-container {
          width: 794px;       /* A4 width in px at 96dpi */
          min-height: 1123px; /* A4 height */
          padding: 32px;
          box-sizing: border-box;
        }
          /* ===== BASIC RESET ===== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ===== FLEX & GRID ===== */
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.grid { display: grid; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

/* ===== GAP ===== */
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }

/* ===== WIDTH / HEIGHT ===== */
.w-4 { width: 1rem; }
.h-4 { height: 1rem; }
.w-full { width: 100%; }
.max-w-2xl { max-width: 42rem; }
.max-w-4xl { max-width: 56rem; }

/* ===== SPACING ===== */
.p-0 { padding: 0; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-7 { padding: 1.75rem; }
.p-8 { padding: 2rem; }
.p-10 { padding: 2.5rem; }

.py-0 { padding-top: 0; padding-bottom: 0; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }

.px-8 { padding-left: 2rem; padding-right: 2rem; }

.mt-6 { margin-top: 1.5rem; }
.mt-10 { margin-top: 2.5rem; }
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: .5rem; }
.mb-3 { margin-bottom: .75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mb-10 { margin-bottom: 2.5rem; }

/* ===== TEXT STYLES ===== */
.text-center { text-align: center; }
.text-left { text-align: left; }

.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-3xl { font-size: 1.875rem; }
.text-5xl { font-size: 3rem; }

.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-black { font-weight: 900; }

/* ===== COLORS ===== */
.text-white { color: white; }
.text-gray-300 { color: #d1d5db; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-gray-800 { color: #1f2937; }

.bg-white { background-color: #ffffff; }
.bg-black\/60 { background-color: rgba(0,0,0,0.6); }
.bg-gray-50 { background-color: #f9fafb; }
.bg-gray-100 { background-color: #f3f4f6; }
.bg-gray-200 { background-color: #e5e7eb; }
.bg-gray-300 { background-color: #d1d5db; }

.bg-blue-50 { background-color: #eff6ff; }
.bg-blue-600 { background-color: #2563eb; }
.bg-blue-700 { background-color: #1d4ed8; }

.bg-yellow-500 { background-color: #eab308; }
.bg-orange-500 { background-color: #f97316; }
.bg-red-500 { background-color: #ef4444; }

/* ===== BORDERS & RADIUS ===== */
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-2xl { border-radius: 1rem; }

.border { border: 1px solid #e5e7eb; }
.border-2 { border-width: 2px; }
.border-blue-600 { border-color: #2563eb; }

/* ===== SHADOW ===== */
.shadow-lg {
  box-shadow: 0 10px 15px rgba(0,0,0,0.1), 
              0 4px 6px rgba(0,0,0,0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px rgba(0,0,0,0.15),
              0 10px 10px rgba(0,0,0,0.1);
}

/* ===== BUTTONS ===== */
button {
  cursor: pointer;
  border: none;
  outline: none;
}

.hover\:bg-gray-300:hover { background-color: #d1d5db; }
.hover\:bg-blue-700:hover { background-color: #1d4ed8; }
.hover\:bg-black:hover { background-color: #000; }

/* ===== POSITIONING ===== */
.relative { position: relative; }
.absolute { position: absolute; }
.inset-0 { inset: 0; }
.z-\[9999\] { z-index: 9999; }
.z-\[200000\] { z-index: 200000; }

/* ===== OPACITY ===== */
.opacity-70 { opacity: .7; }
.opacity-0 { opacity: 0; }
.opacity-100 { opacity: 1; }

/* ===== CURSOR ===== */
.cursor-pointer { cursor: pointer; }

/* ===== ANIMATION UTILS ===== */
.group:hover .group-hover\:animate-bounce {
  animation: bounce 0.6s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

      </style>
      <div id="export-container">${htmlContent}</div>
      `;

      await new Promise(res => setTimeout(res, 300)); // allow render

      const container = document.getElementById("export-container");
      if (!container) return;

      // Screenshot the container
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
      });

      // === PNG DOWNLOAD ===
      if (format === "png") {
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = "resume.png";
        link.click();
        window.close();
        return;
      }

      // === PDF DOWNLOAD ===
      if (format === "pdf") {
        const imgData = canvas.toDataURL("image/png");

        // create PDF via browser print pipeline
        const pdfWindow = window.open("", "_blank");
        pdfWindow.document.write(`
          <html><body style="margin:0;">
            <img src="${imgData}" style="width:100%">
          </body></html>
        `);
        pdfWindow.document.close();
        pdfWindow.print();
        pdfWindow.close();
        window.close();
      }
    };

    run();
  }, []);

  return null;
}
