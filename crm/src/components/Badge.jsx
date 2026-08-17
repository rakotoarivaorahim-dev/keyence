const TONES = {
  'RDV pris': 'blue',
  'Vente conclue': 'green',
  'À relancer': 'amber',
  'Sans suite': 'gray',
  'Validé': 'green',
  'Refusé': 'gray',
  "À l'étude": 'blue',
  'Test en cours': 'amber',
  'Devis envoyé': 'blue',
  'En attente budget': 'amber',
};

export default function Badge({ children }) {
  const tone = TONES[children] || 'gray';
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
