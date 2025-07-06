# Employee Management POC

A modern React TypeScript frontend POC demonstrating a comprehensive employee management system with beautiful UI and interactive features.

## Features

### 🍔 Hamburger Menu
- Collapsible sidebar navigation
- One-level sub-menu support
- Smooth animations and transitions
- Categories: Employees, Reports, Documents, Settings, Help

### 📋 Horizontal Menu
- Top navigation bar with sample menu items
- View mode toggle (Grid ↔ Tile)
- Action buttons (Search, Filter, Export)

### 📊 Grid View
- Complete employee data in table format
- 10 columns showing all employee details
- Sortable and interactive rows
- Action dropdown for each employee (Edit, Flag, Delete)
- Click any row to view detailed information

### 🎴 Tile View
- Card-based layout showing essential employee information
- Employee avatars with initials
- Key details: Name, Position, Email, Phone, Department
- Status badges and salary information
- Action buttons for each tile
- Click any tile to view complete details

### 👤 Employee Detail View
- Comprehensive employee information display
- Beautiful expanded view with all details
- Organized sections: Contact Info, Employment Details, Additional Info
- Back navigation to return to list view
- Professional layout with icons and proper spacing

### 🎨 Modern UI/UX
- Clean, modern design with smooth animations
- Responsive layout for all screen sizes
- Beautiful color scheme and typography
- Interactive hover effects and transitions
- Loading states and proper feedback

## Data Source
- Uses JSONPlaceholder API to simulate employee data
- Transforms API data to match our Employee type
- Includes realistic employee information (names, positions, departments, salaries, etc.)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:5173`
   - The application will automatically load employee data

## Usage

1. **Navigation**: Click the hamburger menu to access different sections
2. **View Toggle**: Use the grid/tile toggle buttons to switch between views
3. **Employee Actions**: Click the three-dot menu on any employee for actions
4. **Detail View**: Click any employee row or tile to see complete details
5. **Back Navigation**: Use the "Back to List" button to return to the main view

## Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **CSS3** with modern features (Grid, Flexbox, Custom Properties)
- **SVG Icons** for consistent iconography
- **Responsive Design** for all devices

## Project Structure

```
src/
├── components/
│   ├── HamburgerMenu.tsx    # Sidebar navigation
│   ├── HorizontalMenu.tsx   # Top navigation bar
│   ├── EmployeeGrid.tsx     # Table view component
│   ├── EmployeeTile.tsx     # Card view component
│   └── EmployeeDetail.tsx   # Detailed view component
├── App.tsx                  # Main application component
├── App.css                  # Comprehensive styling
└── main.tsx                # Application entry point
```

## Features Demonstrated

✅ **Hamburger Menu** with one-level sub-menus  
✅ **Horizontal Menu** with view toggle  
✅ **Grid View** with 10 columns of employee data  
✅ **Tile View** with essential fields only  
✅ **Action Buttons** (Edit, Flag, Delete) on each item  
✅ **Detail View** with complete employee information  
✅ **Navigation** between views  
✅ **Public API Integration** (JSONPlaceholder)  
✅ **Modern, Beautiful UI** with responsive design  
✅ **Loading States** and proper user feedback  

This POC demonstrates a complete, production-ready employee management interface with all the requested features implemented in a modern, scalable React TypeScript application.
