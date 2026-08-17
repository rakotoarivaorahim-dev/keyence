import { Router } from 'express';
import { db, nextId } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const rows = db
    .prepare(
      `SELECT c.*, e.nom AS entreprise_nom FROM contacts c
       LEFT JOIN entreprises e ON e.id = c.entreprise_id
       ORDER BY c.id DESC`
    )
    .all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db
    .prepare(
      `SELECT c.*, e.nom AS entreprise_nom FROM contacts c
       LEFT JOIN entreprises e ON e.id = c.entreprise_id
       WHERE c.id = ?`
    )
    .get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Contact introuvable' });
  res.json(row);
});

router.get('/:id/activites', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM activites WHERE contact_id = ? ORDER BY date DESC')
    .all(req.params.id);
  res.json(rows);
});

function validateEntreprise(entreprise_id) {
  if (!entreprise_id) return 'Un contact doit être rattaché à une entreprise';
  const exists = db.prepare('SELECT 1 FROM entreprises WHERE id = ?').get(entreprise_id);
  if (!exists) return "L'entreprise liée est introuvable";
  return null;
}

router.post('/', (req, res) => {
  const { nom, prenom, telephone_direct, mobile, email, poste, rang, entreprise_id } = req.body;
  if (!nom) return res.status(400).json({ error: 'Le nom est obligatoire' });
  const err = validateEntreprise(entreprise_id);
  if (err) return res.status(400).json({ error: err });
  const id = nextId('contact');
  db.prepare(
    `INSERT INTO contacts (id, nom, prenom, telephone_direct, mobile, email, poste, rang, entreprise_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, nom, prenom || null, telephone_direct || null, mobile || null, email || null, poste || null, rang || null, entreprise_id);
  res.status(201).json(db.prepare('SELECT * FROM contacts WHERE id = ?').get(id));
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Contact introuvable' });
  const { nom, prenom, telephone_direct, mobile, email, poste, rang, entreprise_id } = req.body;
  if (!nom) return res.status(400).json({ error: 'Le nom est obligatoire' });
  const err = validateEntreprise(entreprise_id);
  if (err) return res.status(400).json({ error: err });
  db.prepare(
    `UPDATE contacts SET nom=?, prenom=?, telephone_direct=?, mobile=?, email=?, poste=?, rang=?, entreprise_id=? WHERE id=?`
  ).run(nom, prenom || null, telephone_direct || null, mobile || null, email || null, poste || null, rang || null, entreprise_id, req.params.id);
  res.json(db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Contact introuvable' });
  res.status(204).end();
});

export default router;
