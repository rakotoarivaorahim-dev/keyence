import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Badge from '../../components/Badge.jsx';
import { contactsApi } from '../../api.js';

export default function ContactActivitesTab() {
  const { contact } = useOutletContext();
  const [activites, setActivites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    contactsApi.activites(contact.id).then(setActivites).finally(() => setLoading(false));
  }, [contact.id]);

  return (
    <div>
      <div className="content-header" style={{ marginBottom: 14 }}>
        <h2 className="section-title" style={{ margin: 0 }}>Activités liées</h2>
        <button
          className="btn"
          onClick={() => navigate(`/activites/nouveau?contact_id=${contact.id}&entreprise_id=${contact.entreprise_id}`)}
        >
          + Nouvelle activité
        </button>
      </div>
      {loading ? (
        <p className="empty-state">Chargement…</p>
      ) : activites.length === 0 ? (
        <p className="empty-state">Aucune activité pour ce contact.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Résultat</th>
              </tr>
            </thead>
            <tbody>
              {activites.map((a) => (
                <tr key={a.id} className="clickable" onClick={() => navigate(`/activites/${a.id}`)}>
                  <td className="id-cell">{a.id}</td>
                  <td>{a.date}</td>
                  <td>{a.type}</td>
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
