export const previewExport = () => {
  const element = document.getElementById("export-area");
  if (!element) return;

  const htmlContent = element.outerHTML;

  // TODO: Put your styles here
  const css = `
    body {
      font-family: sans-serif;
    }

    @page {
      size: A4;
      margin: 20mm;
    }

    body {
      background: #f2f2f2;
      padding: 20px;
    }

    #resume {
      width: 210mm;
      min-height: 297mm;
      background: white;
      padding: 20mm;
      margin: auto;
      box-shadow: 0 0 10px rgba(0,0,0,0.15);
    }
  `;

  const exportHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Resume Export</title>
<style>${css}</style>
</head>
<body>
<div id="resume">${htmlContent}</div>
</body>
</html>
`;

  const win = window.open("", "_blank");
  win.document.open();
  win.document.write(exportHTML);
  win.document.close();
};
