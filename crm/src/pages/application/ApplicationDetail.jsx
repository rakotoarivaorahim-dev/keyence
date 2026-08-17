import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import Badge from '../../components/Badge.jsx';
import { applicationsApi } from '../../api.js';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setApplication(null);
    applicationsApi.get(id).then(setApplication).catch(() => setNotFound(true));
  }, [id]);

  async function handleDelete() {
    if (!confirm(`Supprimer l'application ${id} ?`)) return;
    try {
      await applicationsApi.remove(id);
      navigate('/applications');
    } catch (err) {
      alert(err.message);
    }
  }

  if (notFound) {
    return (
      <Layout title="Application introuvable" breadcrumb={<a href="/applications">Applications</a>}>
        <p className="empty-state">Cette application n'existe pas ou plus.</p>
      </Layout>
    );
  }

  if (!application) {
    return <Layout title="Chargement…" breadcrumb={<a href="/applications">Applications</a>} />;
  }

  return (
    <Layout
      title={`${application.gamme_produit || 'Application'} · ${application.id}`}
      breadcrumb={
        <>
          <a href="/">Accueil</a> / <a href="/applications">Applications</a>
        </>
      }
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => navigate(`/applications/${id}/modifier`)}>
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
          <div className="k">Entreprise liée</div>
          <div className="v">
            {application.entreprise_id ? (
              <Link className="link" to={`/entreprises/${application.entreprise_id}`}>
                {application.entreprise_nom || application.entreprise_id}
              </Link>
            ) : '—'}
          </div>
        </div>
        <div className="detail-field">
          <div className="k">Contact lié</div>
          <div className="v">
            {application.contact_id ? (
              <Link className="link" to={`/contacts/${application.contact_id}`}>
                {application.contact_prenom} {application.contact_nom}
              </Link>
            ) : '—'}
          </div>
        </div>
        <div className="detail-field">
          <div className="k">Gamme/produit concerné</div>
          <div className="v">{application.gamme_produit || '—'}</div>
        </div>
        <div className="detail-field">
          <div className="k">Type d'application</div>
          <div className="v">{application.type_application || '—'}</div>
        </div>
        <div className="detail-field">
          <div className="k">Statut</div>
          <div className="v">{application.statut ? <Badge>{application.statut}</Badge> : '—'}</div>
        </div>
        <div className="detail-field">
          <div className="k">Date</div>
          <div className="v">{application.date || '—'}</div>
        </div>
        <div className="detail-field">
          <div className="k">Montant / budget estimé</div>
          <div className="v">{application.montant_estime != null ? `${application.montant_estime} €` : '—'}</div>
        </div>
      </div>
    </Layout>
  );
}
