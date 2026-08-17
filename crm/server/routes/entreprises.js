import { Router } from 'express';
import { db, nextId } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM entreprises ORDER BY id DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM entreprises WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Entreprise introuvable' });
  res.json(row);
});

router.get('/:id/contacts', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM contacts WHERE entreprise_id = ? ORDER BY id')
    .all(req.params.id);
  res.json(rows);
});

router.get('/:id/activites', (req, res) => {
  const rows = db
    .prepare(
      `SELECT a.*, c.nom AS contact_nom, c.prenom AS contact_prenom
       FROM activites a
       LEFT JOIN contacts c ON c.id = a.contact_id
       WHERE a.entreprise_id = ?
       ORDER BY a.date DESC`
    )
    .all(req.params.id);
  res.json(rows);
});

router.get('/:id/applications', (req, res) => {
  const rows = db
    .prepare(
      `SELECT ap.*, c.nom AS contact_nom, c.prenom AS contact_prenom
       FROM applications ap
       LEFT JOIN contacts c ON c.id = ap.contact_id
       WHERE ap.entreprise_id = ?
       ORDER BY ap.date DESC`
    )
    .all(req.params.id);
  res.json(rows);
});

router.post('/', (req, res) => {
  const { nom, nationalite, adresse, ville, code_postal, type, telephone, siret } = req.body;
  if (!nom) return res.status(400).json({ error: 'Le nom de la compagnie est obligatoire' });
  const id = nextId('entreprise');
  db.prepare(
    `INSERT INTO entreprises (id, nom, nationalite, adresse, ville, code_postal, type, telephone, siret)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, nom, nationalite || null, adresse || null, ville || null, code_postal || null, type || null, telephone || null, siret || null);
  res.status(201).json(db.prepare('SELECT * FROM entreprises WHERE id = ?').get(id));
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM entreprises WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Entreprise introuvable' });
  const { nom, nationalite, adresse, ville, code_postal, type, telephone, siret } = req.body;
  if (!nom) return res.status(400).json({ error: 'Le nom de la compagnie est obligatoire' });
  db.prepare(
    `UPDATE entreprises SET nom=?, nationalite=?, adresse=?, ville=?, code_postal=?, type=?, telephone=?, siret=? WHERE id=?`
  ).run(nom, nationalite || null, adresse || null, ville || null, code_postal || null, type || null, telephone || null, siret || null, req.params.id);
  res.json(db.prepare('SELECT * FROM entreprises WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const linkedContacts = db.prepare('SELECT COUNT(*) c FROM contacts WHERE entreprise_id = ?').get(req.params.id).c;
  if (linkedContacts > 0) {
    return res.status(409).json({ error: 'Impossible de supprimer : des contacts sont rattachés à cette entreprise' });
  }
  const result = db.prepare('DELETE FROM entreprises WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Entreprise introuvable' });
  res.status(204).end();
});

export default router;
