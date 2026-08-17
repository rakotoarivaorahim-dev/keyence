import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import Badge from '../../components/Badge.jsx';
import { activitesApi } from '../../api.js';

export default function ActiviteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activite, setActivite] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setActivite(null);
    activitesApi.get(id).then(setActivite).catch(() => setNotFound(true));
  }, [id]);

  async function handleDelete() {
    if (!confirm(`Supprimer l'activité ${id} ?`)) return;
    try {
      await activitesApi.remove(id);
      navigate('/activites');
    } catch (err) {
      alert(err.message);
    }
  }

  if (notFound) {
    return (
      <Layout title="Activité introuvable" breadcrumb={<a href="/activites">Activités</a>}>
        <p className="empty-state">Cette activité n'existe pas ou plus.</p>
      </Layout>
    );
  }

  if (!activite) {
    return <Layout title="Chargement…" breadcrumb={<a href="/activites">Activités</a>} />;
  }

  return (
    <Layout
      title={`${activite.type} · ${activite.id}`}
      breadcrumb={
        <>
          <a href="/">Accueil</a> / <a href="/activites">Activités</a>
        </>
      }
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => navigate(`/activites/${id}/modifier`)}>
            Modifier
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Supprimer
          </button>
        </>
      }
    >
      <div className="detail-grid">
        <div className="detail-field">
          <div className="k">Date</div>
          <div className="v">{activite.date}</div>
        </div>
        <div className="detail-field">
          <div className="k">Entreprise liée</div>
          <div className="v">
            {activite.entreprise_id ? (
              <Link className="link" to={`/entreprises/${activite.entreprise_id}`}>
                {activite.entreprise_nom || activite.entreprise_id}
              </Link>
            ) : '—'}
          </div>
        </div>
        <div className="detail-field">
          <div className="k">Contact lié</div>
          <div className="v">
            {activite.contact_id ? (
              <Link className="link" to={`/contacts/${activite.contact_id}`}>
                {activite.contact_prenom} {activite.contact_nom}
              </Link>
            ) : '—'}
          </div>
        </div>
        <div className="detail-field">
          <div className="k">Résultat</div>
          <div className="v">{activite.resultat ? <Badge>{activite.resultat}</Badge> : '—'}</div>
        </div>
        <div className="detail-field">
          <div className="k">Prochaine action</div>
          <div className="v">{activite.prochaine_action_texte || '—'}</div>
        </div>
        <div className="detail-field">
          <div className="k">Date prochaine action</div>
          <div className="v">{activite.prochaine_action_date || '—'}</div>
        </div>
      </div>
      <h2 className="section-title">Résumé / notes</h2>
      <div className="panel">
        <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{activite.resume || '—'}</p>
      </div>
    </Layout>
  );
}
