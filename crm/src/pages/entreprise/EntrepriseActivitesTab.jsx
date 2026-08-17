import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Badge from '../../components/Badge.jsx';
import { entreprisesApi } from '../../api.js';

export default function EntrepriseActivitesTab() {
  const { entreprise } = useOutletContext();
  const [activites, setActivites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    entreprisesApi.activites(entreprise.id).then(setActivites).finally(() => setLoading(false));
  }, [entreprise.id]);

  return (
    <div>
      <div className="content-header" style={{ marginBottom: 14 }}>
        <h2 className="section-title" style={{ margin: 0 }}>Activités liées</h2>
        <button className="btn" onClick={() => navigate(`/activites/nouveau?entreprise_id=${entreprise.id}`)}>
          + Nouvelle activité
        </button>
      </div>
      {loading ? (
        <p className="empty-state">Chargement…</p>
      ) : activites.length === 0 ? (
        <p className="empty-state">Aucune activité pour cette entreprise.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Contact</th>
                <th>Résultat</th>
              </tr>
            </thead>
            <tbody>
              {activites.map((a) => (
                <tr key={a.id} className="clickable" onClick={() => navigate(`/activites/${a.id}`)}>
                  <td className="id-cell">{a.id}</td>
                  <td>{a.date}</td>
                  <td>{a.type}</td>
                  <td>{a.contact_nom ? `${a.contact_prenom || ''} ${a.contact_nom}` : '—'}</td>
                  <td>{a.resultat ? <Badge>{a.resultat}</Badge> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
