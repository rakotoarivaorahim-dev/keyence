import { useOutletContext } from 'react-router-dom';

export default function EntrepriseInfoTab() {
  const { entreprise } = useOutletContext();

  const fields = [
    ['Identifiant', entreprise.id],
    ['Type', entreprise.type],
    ['Nationalité', entreprise.nationalite],
    ['Adresse', entreprise.adresse],
    ['Ville', entreprise.ville],
    ['Code postal', entreprise.code_postal],
    ['Téléphone', entreprise.telephone],
    ['Numéro SIRET', entreprise.siret],
  ];

  return (
    <div className="detail-grid">
      {fields.map(([k, v]) => (
        <div className="detail-field" key={k}>
          <div className="k">{k}</div>
          <div className="v">{v || '—'}</div>
        </div>
      ))}
    </div>
  );
}
