async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Erreur ${res.status}`);
  }
  return data;
}

function makeResource(name) {
  return {
    list: () => request(`/${name}`),
    get: (id) => request(`/${name}/${id}`),
    create: (body) => request(`/${name}`, { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/${name}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => request(`/${name}/${id}`, { method: 'DELETE' }),
  };
}

export const entreprisesApi = {
  ...makeResource('entreprises'),
  contacts: (id) => request(`/entreprises/${id}/contacts`),
  activites: (id) => request(`/entreprises/${id}/activites`),
  applications: (id) => request(`/entreprises/${id}/applications`),
};

export const contactsApi = {
  ...makeResource('contacts'),
  activites: (id) => request(`/contacts/${id}/activites`),
};

export const activitesApi = {
  ...makeResource('activites'),
  prochainesActions: () => request('/activites/prochaines-actions'),
};

export const applicationsApi = {
  ...makeResource('applications'),
};
