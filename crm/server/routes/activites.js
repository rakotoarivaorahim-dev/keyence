import { Router } from 'express';
import { db, nextId } from '../db.js';

const router = Router();

const SELECT_JOINED = `
  SELECT a.*, e.nom AS entreprise_nom, c.nom AS contact_nom, c.prenom AS contact_prenom
  FROM activites a
  LEFT JOIN entreprises e ON e.id = a.entreprise_id
  LEFT JOIN contacts c ON c.id = a.contact_id
`;

router.get('/', (req, res) => {
  const rows = db.prepare(`${SELECT_JOINED} ORDER BY a.date DESC, a.id DESC`).all();
  res.json(rows);
});

router.get('/prochaines-actions', (req, res) => {
  const rows = db
    .prepare(
      `${SELECT_JOINED}
       WHERE a.prochaine_action_date IS NOT NULL AND a.prochaine_action_date != ''
       ORDER BY a.prochaine_action_date ASC`
    )
    .all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare(`${SELECT_JOINED} WHERE a.id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Activité introuvable' });
  res.json(row);
});

router.post('/', (req, res) => {
  const { type, date, entreprise_id, contact_id, resume, resultat, prochaine_action_texte, prochaine_action_date } = req.body;
  if (!type) return res.status(400).json({ error: "Le type d'activité est obligatoire" });
  if (!date) return res.status(400).json({ error: 'La date est obligatoire' });
  const id = nextId('activite');
  db.prepare(
    `INSERT INTO activites (id, type, date, entreprise_id, contact_id, resume, resultat, prochaine_action_texte, prochaine_action_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, type, date, entreprise_id || null, contact_id || null, resume || null, resultat || null, prochaine_action_texte || null, prochaine_action_date || null);
  res.status(201).json(db.prepare(`${SELECT_JOINED} WHERE a.id = ?`).get(id));
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM activites WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Activité introuvable' });
  const { type, date, entreprise_id, contact_id, resume, resultat, prochaine_action_texte, prochaine_action_date } = req.body;
  if (!type) return res.status(400).json({ error: "Le type d'activité est obligatoire" });
  if (!date) return res.status(400).json({ error: 'La date est obligatoire' });
  db.prepare(
    `UPDATE activites SET type=?, date=?, entreprise_id=?, contact_id=?, resume=?, resultat=?, prochaine_action_texte=?, prochaine_action_date=? WHERE id=?`
  ).run(type, date, entreprise_id || null, contact_id || null, resume || null, resultat || null, prochaine_action_texte || null, prochaine_action_date || null, req.params.id);
  res.json(db.prepare(`${SELECT_JOINED} WHERE a.id = ?`).get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM activites WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Activité introuvable' });
  res.status(204).end();
});

export default router;
