import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { contactsApi, entreprisesApi } from '../../api.js';
import { CONTACT_RANGS } from '../../constants.js';

const EMPTY = {
  nom: '', prenom: '', telephone_direct: '', mobile: '', email: '', poste: '', rang: '', entreprise_id: '',
};

export default function ContactForm({ mode }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [entreprises, setEntreprises] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    entreprisesApi.list().then(setEntreprises);
  }, []);

  useEffect(() => {
    if (mode === 'edit' && id) {
      contactsApi.get(id).then((c) => setForm({ ...EMPTY, ...c }));
    } else {
      const preselect = searchParams.get('entreprise_id');
      if (preselect) setForm((f) => ({ ...f, entreprise_id: preselect }));
    }
  }, [mode, id, searchParams]);

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (mode === 'edit') {
        await contactsApi.update(id, form);
        navigate(`/contacts/${id}`);
      } else {
        const created = await contactsApi.create(form);
        navigate(`/contacts/${created.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout
      title={mode === 'edit' ? `Modifier ${id}` : 'Nouveau contact'}
      breadcrumb={
        <>
          <a href="/">Accueil</a> / <a href="/contacts">Contacts</a>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-grid">
          <div className="field">
            <label>Nom <span className="req">*</span></label>
            <input value={form.nom} onChange={set('nom')} required />
          </div>
          <div className="field">
            <label>Prénom</label>
            <input value={form.prenom} onChange={set('prenom')} />
          </div>
          <div className="field full">
            <label>Entreprise liée <span className="req">*</span></label>
            <select value={form.entreprise_id} onChange={set('entreprise_id')} required>
              <option value="">— Sélectionner —</option>
              {entreprises.map((e) => (
                <option key={e.id} value={e.id}>{e.id} — {e.nom}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Numéro direct</label>
            <input value={form.telephone_direct} onChange={set('telephone_direct')} />
          </div>
          <div className="field">
            <label>Mobile</label>
            <input value={form.mobile} onChange={set('mobile')} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} />
          </div>
          <div className="field">
            <label>Poste</label>
            <input value={form.poste} onChange={set('poste')} />
          </div>
          <div className="field full">
            <label>Rang d'importance</label>
            <select value={form.rang} onChange={set('rang')}>
              <option value="">—</option>
              {CONTACT_RANGS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(mode === 'edit' ? `/contacts/${id}` : '/contacts')}
          >
            Annuler
          </button>
        </div>
      </form>
    </Layout>
  );
}
