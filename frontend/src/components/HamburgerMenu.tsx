import React from 'react';

interface HamburgerMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    onFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    subItems?: { id: string; label: string; filter: 'all' | 'active' | 'inactive' }[];
}

// Simple SVG Icons
const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

const XIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const menuItems: MenuItem[] = [
    {
        id: 'employees',
        label: 'Employees',
        icon: <UsersIcon />,
        subItems: [
            { id: 'all', label: 'All Employees', filter: 'all' },
            { id: 'active', label: 'Active Employees', filter: 'active' },
            { id: 'inactive', label: 'Inactive Employees', filter: 'inactive' },
        ]
    }
];

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onToggle, onFilterChange }) => {
    const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

    const toggleSubMenu = (itemId: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                className="hamburger-button"
                onClick={onToggle}
                aria-label="Toggle menu"
            >
                {isOpen ? <XIcon /> : <MenuIcon />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className="menu-overlay" onClick={onToggle} />
            )}

            {/* Side Menu */}
            <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
                <div className="menu-header">
                    <h2>Employee Management</h2>
                    <button onClick={onToggle} className="close-button">
                        <XIcon />
                    </button>
                </div>

                <nav className="menu-nav">
                    {menuItems.map((item) => (
                        <div key={item.id} className="menu-item">
                            <button
                                className={`menu-button ${expandedItems.has(item.id) ? 'expanded' : ''}`}
                                onClick={() => item.subItems ? toggleSubMenu(item.id) : undefined}
                            >
                                <span className="menu-icon">{item.icon}</span>
                                <span className="menu-label">{item.label}</span>
                                {item.subItems && (
                                    <span className="expand-icon">
                                        {expandedItems.has(item.id) ? '▼' : '▶'}
                                    </span>
                                )}
                            </button>

                            {item.subItems && expandedItems.has(item.id) && (
                                <div className="sub-menu">
                                    {item.subItems.map((subItem) => (
                                        <button
                                            key={subItem.id}
                                            className="sub-menu-item"
                                            onClick={() => {
                                                onFilterChange(subItem.filter);
                                                onToggle();
                                            }}
                                        >
                                            {subItem.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default HamburgerMenu; 