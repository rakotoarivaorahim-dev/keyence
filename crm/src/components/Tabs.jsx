import { NavLink } from 'react-router-dom';

export default function Tabs({ items }) {
  return (
    <div className="tabs">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `tab${isActive ? ' tab-active' : ''}`}
        >
          {item.label}
          {item.count != null && <span className="tab-count">{item.count}</span>}
        </NavLink>
      ))}
    </div>
  );
}
