import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { entreprisesApi } from '../../api.js';

export default function EntrepriseList() {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    entreprisesApi.list().then(setEntreprises).finally(() => setLoading(false));
  }, []);

  return (
    <Layout
      title="Entreprises"
      breadcrumb={<a href="/">Accueil</a>}
      actions={
        <button className="btn" onClick={() => navigate('/entreprises/nouveau')}>
          + Nouvelle entreprise
        </button>
      }
    >
      {loading ? (
        <p className="empty-state">Chargement…</p>
      ) : entreprises.length === 0 ? (
        <p className="empty-state">Aucune entreprise pour le moment.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Ville</th>
                <th>Type</th>
                <th>Téléphone</th>
              </tr>
            </thead>
            <tbody>
              {entreprises.map((e) => (
                <tr key={e.id} className="clickable" onClick={() => navigate(`/entreprises/${e.id}`)}>
                  <td className="id-cell">{e.id}</td>
                  <td>{e.nom}</td>
                  <td>{e.ville || '—'}</td>
                  <td>{e.type || '—'}</td>
                  <td>{e.telephone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
