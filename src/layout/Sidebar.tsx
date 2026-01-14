import { NavLink } from "react-router-dom";

const links = [
    { to: "/", label: "Dashboard" },
    { to: "/campaigns", label: "Campaigns" },
    { to: "/subscribers", label: "Subscribers" },
    { to: "/lists", label: "Lists" },
    { to: "/analytics", label: "Analytics" },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-black text-white hidden md:block">
            <div className="p-4 font-bold text-lg">Email Panel</div>
            <nav className="space-y-1">
                {links.map((l) => (
                    <NavLink
                        key={l.to}
                        to={l.to}
                        className={({ isActive }) =>
                            `block px-4 py-2 ${isActive ? "bg-gray-800" : "hover:bg-gray-900"
                            }`
                        }
                    >
                        {l.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
