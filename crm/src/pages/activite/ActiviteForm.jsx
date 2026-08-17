import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { activitesApi, contactsApi, entreprisesApi } from '../../api.js';
import { ACTIVITE_RESULTATS, ACTIVITE_TYPES } from '../../constants.js';

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  type: '', date: today(), entreprise_id: '', contact_id: '', resume: '', resultat: '',
  prochaine_action_texte: '', prochaine_action_date: '',
};

export default function ActiviteForm({ mode }) {
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
      activitesApi.get(id).then((a) => setForm({ ...EMPTY, ...a }));
    } else {
      const entreprise_id = searchParams.get('entreprise_id') || '';
      const contact_id = searchParams.get('contact_id') || '';
      if (entreprise_id || contact_id) {
        setForm((f) => ({ ...f, entreprise_id, contact_id }));
      }
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
      if (mode === 'edit') {
        await activitesApi.update(id, form);
        navigate(`/activites/${id}`);
      } else {
        const created = await activitesApi.create(form);
        navigate(`/activites/${created.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout
      title={mode === 'edit' ? `Modifier ${id}` : 'Nouvelle activité'}
      breadcrumb={
        <>
          <a href="/">Accueil</a> / <a href="/activites">Activités</a>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-grid">
          <div className="field">
            <label>Type d'activité <span className="req">*</span></label>
            <select value={form.type} onChange={set('type')} required>
              <option value="">—</option>
              {ACTIVITE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Date <span className="req">*</span></label>
            <input type="date" value={form.date} onChange={set('date')} required />
          </div>
          <div className="field">
            <label>Entreprise liée</label>
            <select value={form.entreprise_id} onChange={setEntreprise}>
              <option value="">—</option>
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
          <div className="field full">
            <label>Résumé / notes</label>
            <textarea rows={4} value={form.resume} onChange={set('resume')} />
          </div>
          <div className="field">
            <label>Résultat</label>
            <select value={form.resultat} onChange={set('resultat')}>
              <option value="">—</option>
              {ACTIVITE_RESULTATS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="field" />
          <div className="field">
            <label>Prochaine action</label>
            <input value={form.prochaine_action_texte} onChange={set('prochaine_action_texte')} placeholder="Ex. Relancer par email" />
          </div>
          <div className="field">
            <label>Date de la prochaine action</label>
            <input type="date" value={form.prochaine_action_date} onChange={set('prochaine_action_date')} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(mode === 'edit' ? `/activites/${id}` : '/activites')}
          >
            Annuler
          </button>
        </div>
      </form>
    </Layout>
  );
}
