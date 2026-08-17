import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import Tabs from '../../components/Tabs.jsx';
import { entreprisesApi } from '../../api.js';

export default function EntrepriseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entreprise, setEntreprise] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setEntreprise(null);
    entreprisesApi.get(id).then(setEntreprise).catch(() => setNotFound(true));
  }, [id, reloadKey]);

  async function handleDelete() {
    if (!confirm(`Supprimer l'entreprise ${id} ?`)) return;
    try {
      await entreprisesApi.remove(id);
      navigate('/entreprises');
    } catch (err) {
      alert(err.message);
    }
  }

  if (notFound) {
    return (
      <Layout title="Entreprise introuvable" breadcrumb={<a href="/entreprises">Entreprises</a>}>
        <p className="empty-state">Cette entreprise n'existe pas ou plus.</p>
      </Layout>
    );
  }

  return (
    <Layout
      title={entreprise ? `${entreprise.nom} · ${entreprise.id}` : 'Chargement…'}
      breadcrumb={
        <>
          <a href="/">Accueil</a> / <a href="/entreprises">Entreprises</a>
        </>
      }
      actions={
        entreprise && (
          <>
            <button className="btn btn-secondary" onClick={() => navigate(`/entreprises/${id}/modifier`)}>
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
          { to: `/entreprises/${id}`, label: 'Informations', end: true },
          { to: `/entreprises/${id}/contacts`, label: 'Contacts' },
          { to: `/entreprises/${id}/activites`, label: 'Activités' },
          { to: `/entreprises/${id}/applications`, label: 'Applications' },
        ]}
      />
      {entreprise && <Outlet context={{ entreprise, refresh: () => setReloadKey((k) => k + 1) }} />}
    </Layout>
  );
}
