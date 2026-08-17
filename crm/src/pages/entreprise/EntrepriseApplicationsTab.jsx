import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Badge from '../../components/Badge.jsx';
import { entreprisesApi } from '../../api.js';

export default function EntrepriseApplicationsTab() {
  const { entreprise } = useOutletContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    entreprisesApi.applications(entreprise.id).then(setApplications).finally(() => setLoading(false));
  }, [entreprise.id]);

  return (
    <div>
      <div className="content-header" style={{ marginBottom: 14 }}>
        <h2 className="section-title" style={{ margin: 0 }}>Applications liées</h2>
        <button className="btn" onClick={() => navigate(`/applications/nouveau?entreprise_id=${entreprise.id}`)}>
          + Nouvelle application
        </button>
      </div>
      {loading ? (
        <p className="empty-state">Chargement…</p>
      ) : applications.length === 0 ? (
        <p className="empty-state">Aucune application pour cette entreprise.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
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
    </div>
  );
}
