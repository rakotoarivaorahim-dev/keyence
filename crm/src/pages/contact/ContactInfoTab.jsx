import { Link, useOutletContext } from 'react-router-dom';
import { CONTACT_RANGS } from '../../constants.js';

const RANG_LABEL = Object.fromEntries(CONTACT_RANGS.map((r) => [r.value, r.label]));

export default function ContactInfoTab() {
  const { contact } = useOutletContext();

  const fields = [
    ['Identifiant', contact.id],
    ['Poste', contact.poste],
    ['Rang d\'importance', contact.rang ? RANG_LABEL[contact.rang] : null],
    ['Numéro direct', contact.telephone_direct],
    ['Mobile', contact.mobile],
    ['Email', contact.email],
  ];

  return (
    <div className="detail-grid">
      <div className="detail-field">
        <div className="k">Entreprise liée</div>
        <div className="v">
          {contact.entreprise_id ? (
            <Link className="link" to={`/entreprises/${contact.entreprise_id}`}>
              {contact.entreprise_nom || contact.entreprise_id}
            </Link>
          ) : '—'}
        </div>
      </div>
      {fields.map(([k, v]) => (
        <div className="detail-field" key={k}>
          <div className="k">{k}</div>
          <div className="v">{v || '—'}</div>
        </div>
      ))}
    </div>
  );
}
