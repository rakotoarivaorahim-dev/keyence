import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import Badge from '../../components/Badge.jsx';
import { activitesApi } from '../../api.js';
import { ACTIVITE_TYPES } from '../../constants.js';

export default function ActiviteList() {
  const [activites, setActivites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = searchParams.get('type') || '';

  useEffect(() => {
    activitesApi.list().then(setActivites).finally(() => setLoading(false));
  }, []);

  const filtered = activeType ? activites.filter((a) => a.type === activeType) : activites;

  return (
    <Layout
      title="Activités"
      breadcrumb={<a href="/">Accueil</a>}
      actions={
        <button className="btn" onClick={() => navigate('/activites/nouveau')}>
          + Nouvelle activité
        </button>
      }
    >
      <div className="tabs">
        <button
          type="button"
          className={`tab${activeType === '' ? ' tab-active' : ''}`}
          onClick={() => setSearchParams({})}
        >
          Toutes
        </button>
        {ACTIVITE_TYPES.map((t) => (
          <button
            type="button"
            key={t}
            className={`tab${activeType === t ? ' tab-active' : ''}`}
            onClick={() => setSearchParams({ type: t })}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty-state">Chargement…</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">Aucune activité.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Entreprise</th>
                <th>Contact</th>
                <th>Résultat</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="clickable" onClick={() => navigate(`/activites/${a.id}`)}>
                  <td className="id-cell">{a.id}</td>
                  <td>{a.date}</td>
                  <td>{a.type}</td>
                  <td>{a.entreprise_nom || '—'}</td>
                  <td>{a.contact_nom ? `${a.contact_prenom || ''} ${a.contact_nom}` : '—'}</td>
                  <td>{a.resultat ? <Badge>{a.resultat}</Badge> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
