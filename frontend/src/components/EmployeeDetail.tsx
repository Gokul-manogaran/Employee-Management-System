import React from 'react';
import type { Employee } from '../App';

interface EmployeeDetailProps {
    employee: Employee;
    onBack: () => void;
}

// Simple SVG Icons
const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12,19 5,12 12,5"></polyline>
    </svg>
);

const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const MapPinIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const DollarSignIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const BuildingIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <rect x="9" y="9" width="1" height="1"></rect>
        <rect x="14" y="9" width="1" height="1"></rect>
        <rect x="9" y="14" width="1" height="1"></rect>
        <rect x="14" y="14" width="1" height="1"></rect>
        <rect x="9" y="19" width="1" height="1"></rect>
        <rect x="14" y="19" width="1" height="1"></rect>
    </svg>
);

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee, onBack }) => {
    return (
        <div className="employee-detail">
            <div className="detail-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                    Back to List
                </button>
                <h1>Employee Details</h1>
            </div>

            <div className="detail-content">
                <div className="detail-card">
                    <div className="employee-profile">
                        <div className="profile-avatar">
                            {employee.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-info">
                            <h2>{employee.name}</h2>
                            <p className="position">{employee.position}</p>
                            <span className={`status-badge ${employee.status}`}>
                                {employee.status}
                            </span>
                        </div>
                    </div>

                    <div className="detail-sections">
                        <div className="detail-section">
                            <h3>Contact Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <MailIcon />
                                    <div>
                                        <label>Email</label>
                                        <span>{employee.email}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <PhoneIcon />
                                    <div>
                                        <label>Phone</label>
                                        <span>{employee.phone}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <MapPinIcon />
                                    <div>
                                        <label>Address</label>
                                        <span>{employee.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>Employment Details</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <BuildingIcon />
                                    <div>
                                        <label>Department</label>
                                        <span>{employee.department}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <UserIcon />
                                    <div>
                                        <label>Manager</label>
                                        <span>{employee.manager}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <CalendarIcon />
                                    <div>
                                        <label>Hire Date</label>
                                        <span>{new Date(employee.hireDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <DollarSignIcon />
                                    <div>
                                        <label>Salary</label>
                                        <span>${employee.salary.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>Additional Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <div>
                                        <label>Employee ID</label>
                                        <span>{employee.id}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div>
                                        <label>Status</label>
                                        <span className={`status-badge ${employee.status}`}>
                                            {employee.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetail; 