import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'crm.db');

import fs from 'fs';
fs.mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS counters (
  module TEXT PRIMARY KEY,
  current INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS entreprises (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  nationalite TEXT,
  adresse TEXT,
  ville TEXT,
  code_postal TEXT,
  type TEXT,
  telephone TEXT,
  siret TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT,
  telephone_direct TEXT,
  mobile TEXT,
  email TEXT,
  poste TEXT,
  rang TEXT,
  entreprise_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (entreprise_id) REFERENCES entreprises(id)
);

CREATE TABLE IF NOT EXISTS activites (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  entreprise_id TEXT,
  contact_id TEXT,
  resume TEXT,
  resultat TEXT,
  prochaine_action_texte TEXT,
  prochaine_action_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (entreprise_id) REFERENCES entreprises(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  entreprise_id TEXT,
  contact_id TEXT,
  gamme_produit TEXT,
  type_application TEXT,
  statut TEXT,
  date TEXT,
  montant_estime REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (entreprise_id) REFERENCES entreprises(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);
`);

const MODULE_START = {
  entreprise: 0,
  contact: 10000,
  activite: 20000,
  application: 30000,
};

const MODULE_WIDTH = {
  entreprise: 4,
  contact: 5,
  activite: 5,
  application: 5,
};

const initCounter = db.prepare(
  'INSERT OR IGNORE INTO counters (module, current) VALUES (?, ?)'
);
for (const [module, start] of Object.entries(MODULE_START)) {
  initCounter.run(module, start);
}

const getCounter = db.prepare('SELECT current FROM counters WHERE module = ?');
const bumpCounter = db.prepare(
  'UPDATE counters SET current = current + 1 WHERE module = ?'
);

export function nextId(module) {
  const tx = db.transaction(() => {
    bumpCounter.run(module);
    const row = getCounter.get(module);
    return row.current;
  });
  const value = tx();
  return String(value).padStart(MODULE_WIDTH[module], '0');
}
