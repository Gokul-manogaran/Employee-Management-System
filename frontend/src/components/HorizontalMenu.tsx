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