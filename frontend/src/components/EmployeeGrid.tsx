import React, { useState } from 'react';
import type { Employee } from '../App';

interface EmployeeGridProps {
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

const PAGE_SIZE = 10;

const EmployeeGrid: React.FC<EmployeeGridProps> = ({
    employees,
    loading,
    onEmployeeAction,
    onEmployeeClick
}) => {
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [page, setPage] = useState(1);

    const total = employees.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const paginatedEmployees = employees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        <div className="employee-grid">
            <div className="grid-header">
                <h2>Employee Directory</h2>
                <p>{total} employees found</p>
            </div>

            <div className="grid-container">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>Department</th>
                            <th>Salary</th>
                            <th>Hire Date</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEmployees.map((employee) => (
                            <tr
                                key={employee.id}
                                className="employee-row"
                                onClick={() => onEmployeeClick(employee)}
                            >
                                <td>{employee.id}</td>
                                <td className="employee-name">{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.position}</td>
                                <td>{employee.department}</td>
                                <td>${employee.salary.toLocaleString()}</td>
                                <td>{new Date(employee.hireDate).toLocaleDateString()}</td>
                                <td>{employee.phone}</td>
                                <td>
                                    <span className={`status-badge ${employee.status}`}>
                                        {employee.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-dropdown">
                                        <button
                                            className="dropdown-toggle"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown(employee.id);
                                            }}
                                        >
                                            <MoreVerticalIcon />
                                        </button>
                                        {dropdownOpen === employee.id && (
                                            <div className="dropdown-menu">
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <button
                    className="pagination-btn"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`pagination-btn${page === i + 1 ? ' active' : ''}`}
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="pagination-btn"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </button>
                <span className="pagination-info">
                    Page {page} of {totalPages}
                </span>
            </div>
        </div>
    );
};

export default EmployeeGrid; 