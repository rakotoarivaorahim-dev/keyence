import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import Tabs from '../../components/Tabs.jsx';
import { contactsApi } from '../../api.js';

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setContact(null);
    contactsApi.get(id).then(setContact).catch(() => setNotFound(true));
  }, [id]);

  async function handleDelete() {
    if (!confirm(`Supprimer le contact ${id} ?`)) return;
    try {
      await contactsApi.remove(id);
      navigate('/contacts');
    } catch (err) {
      alert(err.message);
    }
  }

  if (notFound) {
    return (
      <Layout title="Contact introuvable" breadcrumb={<a href="/contacts">Contacts</a>}>
        <p className="empty-state">Ce contact n'existe pas ou plus.</p>
      </Layout>
    );
  }

  return (
    <Layout
      title={contact ? `${contact.prenom} ${contact.nom} · ${contact.id}` : 'Chargement…'}
      breadcrumb={
        <>
          <a href="/">Accueil</a> / <a href="/contacts">Contacts</a>
        </>
      }
      actions={
        contact && (
          <>
            <button className="btn btn-secondary" onClick={() => navigate(`/contacts/${id}/modifier`)}>
              Modifier
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Supprimer
            </button>
          </>
        )
      }
    >
      <Tabs
        items={[
          { to: `/contacts/${id}`, label: 'Informations', end: true },
          { to: `/contacts/${id}/activites`, label: 'Activités' },
        ]}
      />
      {contact && <Outlet context={{ contact }} />}
    </Layout>
  );
}
