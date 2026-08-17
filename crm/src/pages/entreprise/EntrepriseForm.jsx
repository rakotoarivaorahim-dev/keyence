import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { entreprisesApi } from '../../api.js';
import { ENTREPRISE_TYPES } from '../../constants.js';

const EMPTY = {
  nom: '', nationalite: '', adresse: '', ville: '', code_postal: '', type: '', telephone: '', siret: '',
};

export default function EntrepriseForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && id) {
      entreprisesApi.get(id).then((e) => setForm({ ...EMPTY, ...e }));
    }
  }, [mode, id]);

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (mode === 'edit') {
        await entreprisesApi.update(id, form);
        navigate(`/entreprises/${id}`);
      } else {
        const created = await entreprisesApi.create(form);
        navigate(`/entreprises/${created.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout
      title={mode === 'edit' ? `Modifier ${id}` : 'Nouvelle entreprise'}
      breadcrumb={
        <>
          <a href="/">Accueil</a> / <a href="/entreprises">Entreprises</a>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-grid">
          <div className="field full">
            <label>Nom de la compagnie <span className="req">*</span></label>
            <input value={form.nom} onChange={set('nom')} required />
          </div>
          <div className="field">
            <label>Type d'entreprise</label>
            <select value={form.type} onChange={set('type')}>
              <option value="">—</option>
              {ENTREPRISE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Nationalité</label>
            <input value={form.nationalite} onChange={set('nationalite')} />
          </div>
          <div className="field full">
            <label>Adresse</label>
            <input value={form.adresse} onChange={set('adresse')} />
          </div>
          <div className="field">
            <label>Ville</label>
            <input value={form.ville} onChange={set('ville')} />
          </div>
          <div className="field">
            <label>Code postal</label>
            <input value={form.code_postal} onChange={set('code_postal')} />
          </div>
          <div className="field">
            <label>Téléphone</label>
            <input value={form.telephone} onChange={set('telephone')} />
          </div>
          <div className="field">
            <label>Numéro SIRET</label>
            <input value={form.siret} onChange={set('siret')} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(mode === 'edit' ? `/entreprises/${id}` : '/entreprises')}
          >
            Annuler
          </button>
        </div>
      </form>
    </Layout>
  );
}
