import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/compile', (req, res) => {
  const { latex } = req.body;
  const tmp = os.tmpdir();
  const texPath = path.join(tmp, 'resume.tex');
  const pdfPath = path.join(tmp, 'resume.pdf');

  console.log('Received LaTeX:', latex.slice(0, 100));

  fs.writeFileSync(texPath, latex);

  exec(`pdflatex -interaction=nonstopmode -output-directory=${tmp} ${texPath}`, (err, stdout, stderr) => {
    if (err || !fs.existsSync(pdfPath)) {
      console.error('pdflatex error:', err);
      console.error('stderr:', stderr);
      return res.status(500).json({ error: 'Compilation error', details: stderr });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=resume.pdf');
    res.send(pdfBuffer);

    fs.unlinkSync(texPath);
    fs.unlinkSync(pdfPath);
  });
});

app.listen(3000, () => console.log('✅ Server running on port 3000'));
