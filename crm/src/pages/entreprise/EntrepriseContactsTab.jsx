import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { entreprisesApi } from '../../api.js';

export default function EntrepriseContactsTab() {
  const { entreprise } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    entreprisesApi.contacts(entreprise.id).then(setContacts).finally(() => setLoading(false));
  }, [entreprise.id]);

  return (
    <div>
      <div className="content-header" style={{ marginBottom: 14 }}>
        <h2 className="section-title" style={{ margin: 0 }}>Contacts liés</h2>
        <button className="btn" onClick={() => navigate(`/contacts/nouveau?entreprise_id=${entreprise.id}`)}>
          + Nouveau contact
        </button>
      </div>
      {loading ? (
        <p className="empty-state">Chargement…</p>
      ) : contacts.length === 0 ? (
        <p className="empty-state">Aucun contact rattaché à cette entreprise.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Poste</th>
                <th>Rang</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="clickable" onClick={() => navigate(`/contacts/${c.id}`)}>
                  <td className="id-cell">{c.id}</td>
                  <td>{c.prenom} {c.nom}</td>
                  <td>{c.poste || '—'}</td>
                  <td>{c.rang || '—'}</td>
                  <td>{c.email || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
