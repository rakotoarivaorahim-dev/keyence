import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';

import EntrepriseList from './pages/entreprise/EntrepriseList.jsx';
import EntrepriseForm from './pages/entreprise/EntrepriseForm.jsx';
import EntrepriseDetail from './pages/entreprise/EntrepriseDetail.jsx';
import EntrepriseInfoTab from './pages/entreprise/EntrepriseInfoTab.jsx';
import EntrepriseContactsTab from './pages/entreprise/EntrepriseContactsTab.jsx';
import EntrepriseActivitesTab from './pages/entreprise/EntrepriseActivitesTab.jsx';
import EntrepriseApplicationsTab from './pages/entreprise/EntrepriseApplicationsTab.jsx';

import ContactList from './pages/contact/ContactList.jsx';
import ContactForm from './pages/contact/ContactForm.jsx';
import ContactDetail from './pages/contact/ContactDetail.jsx';
import ContactInfoTab from './pages/contact/ContactInfoTab.jsx';
import ContactActivitesTab from './pages/contact/ContactActivitesTab.jsx';

import ActiviteList from './pages/activite/ActiviteList.jsx';
import ActiviteForm from './pages/activite/ActiviteForm.jsx';
import ActiviteDetail from './pages/activite/ActiviteDetail.jsx';

import ApplicationList from './pages/application/ApplicationList.jsx';
import ApplicationForm from './pages/application/ApplicationForm.jsx';
import ApplicationDetail from './pages/application/ApplicationDetail.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/entreprises" element={<EntrepriseList />} />
        <Route path="/entreprises/nouveau" element={<EntrepriseForm mode="create" />} />
        <Route path="/entreprises/:id/modifier" element={<EntrepriseForm mode="edit" />} />
        <Route path="/entreprises/:id" element={<EntrepriseDetail />}>
          <Route index element={<EntrepriseInfoTab />} />
          <Route path="contacts" element={<EntrepriseContactsTab />} />
          <Route path="activites" element={<EntrepriseActivitesTab />} />
          <Route path="applications" element={<EntrepriseApplicationsTab />} />
        </Route>

        <Route path="/contacts" element={<ContactList />} />
        <Route path="/contacts/nouveau" element={<ContactForm mode="create" />} />
        <Route path="/contacts/:id/modifier" element={<ContactForm mode="edit" />} />
        <Route path="/contacts/:id" element={<ContactDetail />}>
          <Route index element={<ContactInfoTab />} />
          <Route path="activites" element={<ContactActivitesTab />} />
        </Route>

        <Route path="/activites" element={<ActiviteList />} />
        <Route path="/activites/nouveau" element={<ActiviteForm mode="create" />} />
        <Route path="/activites/:id/modifier" element={<ActiviteForm mode="edit" />} />
        <Route path="/activites/:id" element={<ActiviteDetail />} />

        <Route path="/applications" element={<ApplicationList />} />
        <Route path="/applications/nouveau" element={<ApplicationForm mode="create" />} />
        <Route path="/applications/:id/modifier" element={<ApplicationForm mode="edit" />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
