import { Link } from 'react-router-dom';

export default function Layout({ title, breadcrumb, actions, children }) {
  return (
    <div className="page">
      <header className="topbar">
        <Link to="/" className="brand">
          Prospection CRM
        </Link>
        {breadcrumb && <nav className="breadcrumb">{breadcrumb}</nav>}
      </header>
      <main className="content">
        {(title || actions) && (
          <div className="content-header">
            {title && <h1>{title}</h1>}
            {actions && <div className="actions">{actions}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
