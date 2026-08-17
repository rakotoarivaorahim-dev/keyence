import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { applicationsApi, contactsApi, entreprisesApi } from '../../api.js';
import { APPLICATION_STATUTS, APPLICATION_TYPES } from '../../constants.js';

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  entreprise_id: '', contact_id: '', gamme_produit: '', type_application: '', statut: '', date: today(), montant_estime: '',
};

export default function ApplicationForm({ mode }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [entreprises, setEntreprises] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    entreprisesApi.list().then(setEntreprises);
    contactsApi.list().then(setContacts);
  }, []);

  useEffect(() => {
    if (mode === 'edit' && id) {
      applicationsApi.get(id).then((a) => setForm({ ...EMPTY, ...a }));
    } else {
      const entreprise_id = searchParams.get('entreprise_id') || '';
      if (entreprise_id) setForm((f) => ({ ...f, entreprise_id }));
    }
  }, [mode, id, searchParams]);

  const contactsForEntreprise = form.entreprise_id
    ? contacts.filter((c) => c.entreprise_id === form.entreprise_id)
    : contacts;

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  function setEntreprise(e) {
    const entreprise_id = e.target.value;
    const contactStillValid = contacts.find((c) => c.id === form.contact_id && c.entreprise_id === entreprise_id);
    setForm({ ...form, entreprise_id, contact_id: contactStillValid ? form.contact_id : '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, montant_estime: form.montant_estime === '' ? null : Number(form.montant_estime) };
      if (mode === 'edit') {
        await applicationsApi.update(id, payload);
        navigate(`/applications/${id}`);
      } else {
        const created = await applicationsApi.create(payload);
        navigate(`/applications/${created.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout
      title={mode === 'edit' ? `Modifier ${id}` : 'Nouvelle application'}
      breadcrumb={
        <>
          <a href="/">Accueil</a> / <a href="/applications">Applications</a>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-grid">
          <div className="field">
            <label>Entreprise liée <span className="req">*</span></label>
            <select value={form.entreprise_id} onChange={setEntreprise} required>
              <option value="">— Sélectionner —</option>
              {entreprises.map((e) => (
                <option key={e.id} value={e.id}>{e.id} — {e.nom}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Contact lié</label>
            <select value={form.contact_id} onChange={set('contact_id')}>
              <option value="">—</option>
              {contactsForEntreprise.map((c) => (
                <option key={c.id} value={c.id}>{c.id} — {c.prenom} {c.nom}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Gamme/produit concerné</label>
            <input value={form.gamme_produit} onChange={set('gamme_produit')} />
          </div>
          <div className="field">
            <label>Type d'application</label>
            <select value={form.type_application} onChange={set('type_application')}>
              <option value="">—</option>
              {APPLICATION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Statut</label>
            <select value={form.statut} onChange={set('statut')}>
              <option value="">—</option>
              {APPLICATION_STATUTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={set('date')} />
          </div>
          <div className="field">
            <label>Montant / budget estimé (€)</label>
            <input type="number" min="0" step="0.01" value={form.montant_estime} onChange={set('montant_estime')} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(mode === 'edit' ? `/applications/${id}` : '/applications')}
          >
            Annuler
          </button>
        </div>
      </form>
    </Layout>
  );
}
