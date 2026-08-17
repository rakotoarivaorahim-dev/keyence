import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import entreprisesRouter from './routes/entreprises.js';
import contactsRouter from './routes/contacts.js';
import activitesRouter from './routes/activites.js';
import applicationsRouter from './routes/applications.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/entreprises', entreprisesRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/activites', activitesRouter);
app.use('/api/applications', applicationsRouter);

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CRM server listening on http://localhost:${PORT}`);
});
