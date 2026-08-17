import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { entreprisesApi, contactsApi, activitesApi, applicationsApi } from '../api.js';

const MODULES = [
  { to: '/entreprises', icon: '🏢', title: 'Entreprise', desc: 'Comptes prospects et clients', key: 'entreprises' },
  { to: '/contacts', icon: '👤', title: 'Contact', desc: 'Interlocuteurs rattachés', key: 'contacts' },
  { to: '/activites', icon: '📞', title: 'Activité', desc: 'Phone Call · Visio · Sales Call', key: 'activites' },
  { to: '/applications', icon: '⚙️', title: 'Application', desc: 'Suivi des opportunités produit', key: 'applications' },
];

function isOverdue(dateStr) {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr < today;
}

export default function Home() {
  const [counts, setCounts] = useState({});
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      entreprisesApi.list(),
      contactsApi.list(),
      activitesApi.list(),
      applicationsApi.list(),
      activitesApi.prochainesActions(),
    ])
      .then(([entreprises, contacts, activites, applications, prochaines]) => {
        setCounts({
          entreprises: entreprises.length,
          contacts: contacts.length,
          activites: activites.length,
          applications: applications.length,
        });
        setReminders(prochaines);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h1 style={{ marginBottom: 4 }}>Prospection CRM</h1>
      <p className="home-intro">Pilotage de mes sessions de prospection.</p>

      <div className="card-grid">
        {MODULES.map((m) => (
          <Link key={m.to} to={m.to} className="module-card">
            <span className="icon">{m.icon}</span>
            <h2>{m.title}</h2>
            <p>{m.desc}</p>
            <span className="count">{loading ? '–' : counts[m.key] ?? 0}</span>
            <span className="count-label">fiches</span>
          </Link>
        ))}
      </div>

      <div className="panel">
        <h2>Prochaines actions</h2>
        {loading ? (
          <p className="empty-state">Chargement…</p>
        ) : reminders.length === 0 ? (
          <p className="empty-state">Aucune prochaine action planifiée.</p>
        ) : (
          <div className="reminder-list">
            {reminders.map((r) => (
              <Link
                key={r.id}
                to={`/activites/${r.id}`}
                className={`reminder-item${isOverdue(r.prochaine_action_date) ? ' overdue' : ''}`}
              >
                <span className="rem-text">
                  <strong>{r.prochaine_action_texte || 'Action à faire'}</strong>
                  {' — '}
                  {r.entreprise_nom || 'Entreprise inconnue'}
                  {r.contact_nom ? ` · ${r.contact_prenom || ''} ${r.contact_nom}` : ''}
                </span>
                <span className="rem-date">
                  {isOverdue(r.prochaine_action_date) ? 'En retard · ' : ''}
                  {r.prochaine_action_date}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
