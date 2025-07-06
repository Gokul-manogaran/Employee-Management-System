import React from 'react';
import type { Employee } from '../App';

interface EmployeeTileProps {
    employees: Employee[];
    loading: boolean;
    onEmployeeAction: (employeeId: number, action: 'edit' | 'flag' | 'delete') => void;
    onEmployeeClick: (employee: Employee) => void;
}

// Simple SVG Icons
const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const FlagIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
        <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3,6 5,6 21,6"></polyline>
        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
    </svg>
);

const MoreVerticalIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="19" cy="12" r="1"></circle>
        <circle cx="5" cy="12" r="1"></circle>
    </svg>
);

const MailIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const PhoneIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const MapPinIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const EmployeeTile: React.FC<EmployeeTileProps> = ({
    employees,
    loading,
    onEmployeeAction,
    onEmployeeClick
}) => {
    const [dropdownOpen, setDropdownOpen] = React.useState<number | null>(null);

    const handleActionClick = (employeeId: number, action: 'edit' | 'flag' | 'delete') => {
        onEmployeeAction(employeeId, action);
        setDropdownOpen(null);
    };

    const toggleDropdown = (employeeId: number) => {
        setDropdownOpen(dropdownOpen === employeeId ? null : employeeId);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading employees...</p>
            </div>
        );
    }

    return (
        <div className="employee-tiles">
            <div className="tiles-header">
                <h2>Employee Directory</h2>
                <p>{employees.length} employees found</p>
            </div>

            <div className="tiles-grid">
                {employees.map((employee) => (
                    <div
                        key={employee.id}
                        className="employee-tile"
                        onClick={() => onEmployeeClick(employee)}
                    >
                        <div className="tile-header">
                            <div className="employee-avatar">
                                {employee.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="employee-info">
                                <h3 className="employee-name">{employee.name}</h3>
                                <p className="employee-position">{employee.position}</p>
                            </div>
                            <div className="tile-actions">
                                <button
                                    className="action-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDropdown(employee.id);
                                    }}
                                >
                                    <MoreVerticalIcon />
                                </button>
                                {dropdownOpen === employee.id && (
                                    <div className="tile-dropdown">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleActionClick(employee.id, 'edit');
                                            }}
                                            className="dropdown-item"
                                        >
                                            <EditIcon />
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleActionClick(employee.id, 'flag');
                                            }}
                                            className="dropdown-item"
                                        >
                                            <FlagIcon />
                                            Flag
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleActionClick(employee.id, 'delete');
                                            }}
                                            className="dropdown-item delete"
                                        >
                                            <TrashIcon />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="tile-content">
                            <div className="tile-detail">
                                <MailIcon />
                                <span>{employee.email}</span>
                            </div>
                            <div className="tile-detail">
                                <PhoneIcon />
                                <span>{employee.phone}</span>
                            </div>
                            <div className="tile-detail">
                                <MapPinIcon />
                                <span>{employee.department}</span>
                            </div>
                        </div>

                        <div className="tile-footer">
                            <span className={`status-badge ${employee.status}`}>
                                {employee.status}
                            </span>
                            <span className="salary">
                                ${employee.salary.toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeTile; 