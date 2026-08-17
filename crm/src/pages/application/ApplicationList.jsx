import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import Badge from '../../components/Badge.jsx';
import { applicationsApi } from '../../api.js';

export default function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    applicationsApi.list().then(setApplications).finally(() => setLoading(false));
  }, []);

  return (
    <Layout
      title="Applications"
      breadcrumb={<a href="/">Accueil</a>}
      actions={
        <button className="btn" onClick={() => navigate('/applications/nouveau')}>
          + Nouvelle application
        </button>
      }
    >
      {loading ? (
        <p className="empty-state">Chargement…</p>
      ) : applications.length === 0 ? (
        <p className="empty-state">Aucune application pour le moment.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Entreprise</th>
                <th>Gamme/produit</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id} className="clickable" onClick={() => navigate(`/applications/${a.id}`)}>
                  <td className="id-cell">{a.id}</td>
                  <td>{a.date || '—'}</td>
                  <td>{a.entreprise_nom || '—'}</td>
                  <td>{a.gamme_produit || '—'}</td>
                  <td>{a.type_application || '—'}</td>
                  <td>{a.statut ? <Badge>{a.statut}</Badge> : '—'}</td>
                  <td>{a.montant_estime != null ? `${a.montant_estime} €` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
