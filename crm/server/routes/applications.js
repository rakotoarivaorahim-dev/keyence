import { Router } from 'express';
import { db, nextId } from '../db.js';

const router = Router();

const SELECT_JOINED = `
  SELECT ap.*, e.nom AS entreprise_nom, c.nom AS contact_nom, c.prenom AS contact_prenom
  FROM applications ap
  LEFT JOIN entreprises e ON e.id = ap.entreprise_id
  LEFT JOIN contacts c ON c.id = ap.contact_id
`;

router.get('/', (req, res) => {
  const rows = db.prepare(`${SELECT_JOINED} ORDER BY ap.date DESC, ap.id DESC`).all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare(`${SELECT_JOINED} WHERE ap.id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Application introuvable' });
  res.json(row);
});

router.post('/', (req, res) => {
  const { entreprise_id, contact_id, gamme_produit, type_application, statut, date, montant_estime } = req.body;
  if (!entreprise_id) return res.status(400).json({ error: "L'entreprise liée est obligatoire" });
  const id = nextId('application');
  db.prepare(
    `INSERT INTO applications (id, entreprise_id, contact_id, gamme_produit, type_application, statut, date, montant_estime)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, entreprise_id, contact_id || null, gamme_produit || null, type_application || null, statut || null, date || null, montant_estime || null);
  res.status(201).json(db.prepare(`${SELECT_JOINED} WHERE ap.id = ?`).get(id));
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Application introuvable' });
  const { entreprise_id, contact_id, gamme_produit, type_application, statut, date, montant_estime } = req.body;
  if (!entreprise_id) return res.status(400).json({ error: "L'entreprise liée est obligatoire" });
  db.prepare(
    `UPDATE applications SET entreprise_id=?, contact_id=?, gamme_produit=?, type_application=?, statut=?, date=?, montant_estime=? WHERE id=?`
  ).run(entreprise_id, contact_id || null, gamme_produit || null, type_application || null, statut || null, date || null, montant_estime || null, req.params.id);
  res.json(db.prepare(`${SELECT_JOINED} WHERE ap.id = ?`).get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM applications WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Application introuvable' });
  res.status(204).end();
});

export default router;
