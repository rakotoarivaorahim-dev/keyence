import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import Badge from '../../components/Badge.jsx';
import { contactsApi } from '../../api.js';
import { CONTACT_RANGS } from '../../constants.js';

const RANG_LABEL = Object.fromEntries(CONTACT_RANGS.map((r) => [r.value, r.value]));

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    contactsApi.list().then(setContacts).finally(() => setLoading(false));
  }, []);

  return (
    <Layout
      title="Contacts"
      breadcrumb={<a href="/">Accueil</a>}
      actions={
        <button className="btn" onClick={() => navigate('/contacts/nouveau')}>
          + Nouveau contact
        </button>
      }
    >
      {loading ? (
        <p className="empty-state">Chargement…</p>
      ) : contacts.length === 0 ? (
        <p className="empty-state">Aucun contact pour le moment.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Entreprise</th>
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
                  <td>{c.entreprise_nom || '—'}</td>
                  <td>{c.poste || '—'}</td>
                  <td>{c.rang ? <Badge>{RANG_LABEL[c.rang] || c.rang}</Badge> : '—'}</td>
                  <td>{c.email || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
