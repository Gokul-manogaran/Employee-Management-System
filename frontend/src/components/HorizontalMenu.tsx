import React from 'react';
import type { ViewMode } from '../App';

interface HorizontalMenuProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

// Simple SVG Icons
const GridIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

const SquareIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    </svg>
);

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="M21 21l-4.35-4.35"></path>
    </svg>
);

const FilterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
    </svg>
);

const DownloadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7,10 12,15 17,10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const HorizontalMenu: React.FC<HorizontalMenuProps> = ({ viewMode, onViewModeChange }) => {
    return (
        <div className="horizontal-menu">
            <div className="menu-left">
                <div className="menu-item">
                    <span className="menu-label">Employees</span>
                </div>
            </div>

            <div className="menu-right">
                <div className="view-toggle">
                    <button
                        className={`toggle-button ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => onViewModeChange('grid')}
                        title="Grid View"
                    >
                        <GridIcon />
                    </button>
                    <button
                        className={`toggle-button ${viewMode === 'tile' ? 'active' : ''}`}
                        onClick={() => onViewModeChange('tile')}
                        title="Tile View"
                    >
                        <SquareIcon />
                    </button>
                </div>


            </div>
        </div>
    );
};

export default HorizontalMenu; 