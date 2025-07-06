import React, { useState } from 'react'
import './App.css'
import HamburgerMenu from './components/HamburgerMenu'
import HorizontalMenu from './components/HorizontalMenu'
import EmployeeGrid from './components/EmployeeGrid'
import EmployeeTile from './components/EmployeeTile'
import EmployeeDetail from './components/EmployeeDetail'

export type Employee = {
  id: number
  name: string
  email: string
  position: string
  department: string
  salary: number
  hireDate: string
  phone: string
  address: string
  manager: string
  status: 'active' | 'inactive'
}

export type ViewMode = 'grid' | 'tile'

function App() {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [employeeFilter, setEmployeeFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Fetch employees data on component mount
  React.useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      // Using JSONPlaceholder API to simulate employee data
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      const users = await response.json()

      // Transform the data to match our Employee type
      const employeeData: Employee[] = users.map((user: any, index: number) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        position: ['Software Engineer', 'Product Manager', 'Designer', 'Developer', 'Analyst'][index % 5],
        department: ['Engineering', 'Product', 'Design', 'Marketing', 'Sales'][index % 5],
        salary: 50000 + (index * 5000),
        hireDate: new Date(2020 + (index % 4), (index % 12), (index % 28) + 1).toISOString().split('T')[0],
        phone: user.phone,
        address: `${user.address.street}, ${user.address.city}`,
        manager: ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Brown'][index % 4],
        status: index % 3 === 0 ? 'inactive' : 'active'
      }))

      setEmployees(employeeData)
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmployeeAction = (employeeId: number, action: 'edit' | 'flag' | 'delete') => {
    switch (action) {
      case 'edit':
        const employee = employees.find(emp => emp.id === employeeId)
        if (employee) {
          setEditingEmployee(employee)
        }
        break
      case 'flag':
        alert(`Employee ${employeeId} has been flagged!`)
        break
      case 'delete':
        if (confirm('Are you sure you want to delete this employee?')) {
          setEmployees(prev => prev.filter(emp => emp.id !== employeeId))
        }
        break
    }
  }

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee)
  }

  const handleBackToGrid = () => {
    setSelectedEmployee(null)
  }

  const handleSaveEdit = (updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp))
    setEditingEmployee(null)
  }

  const handleCancelEdit = () => {
    setEditingEmployee(null)
  }

  const filteredEmployees = employees.filter(emp =>
    employeeFilter === 'all' ? true : emp.status === employeeFilter
  )

  return (
    <div className="app">
      <HamburgerMenu
        isOpen={isHamburgerOpen}
        onToggle={() => setIsHamburgerOpen(!isHamburgerOpen)}
        onFilterChange={setEmployeeFilter}
      />

      <div className="main-content">
        <HorizontalMenu
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        // hideEmployeesLabel={isHamburgerOpen}
        />

        <div className="content-area">
          {selectedEmployee ? (
            <EmployeeDetail
              employee={selectedEmployee}
              onBack={handleBackToGrid}
            />
          ) : (
            <>
              {viewMode === 'grid' ? (
                <EmployeeGrid
                  employees={filteredEmployees}
                  loading={loading}
                  onEmployeeAction={handleEmployeeAction}
                  onEmployeeClick={handleEmployeeClick}
                />
              ) : (
                <EmployeeTile
                  employees={filteredEmployees}
                  loading={loading}
                  onEmployeeAction={handleEmployeeAction}
                  onEmployeeClick={handleEmployeeClick}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Simple Edit Modal */}
      {editingEmployee && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Employee</h3>
            <div className="edit-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, email: e.target.value } : null)}
                />
              </div>
              <div className="form-group">
                <label>Position:</label>
                <input
                  type="text"
                  value={editingEmployee.position}
                  onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, position: e.target.value } : null)}
                />
              </div>
              <div className="form-group">
                <label>Department:</label>
                <input
                  type="text"
                  value={editingEmployee.department}
                  onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, department: e.target.value } : null)}
                />
              </div>
              <div className="form-group">
                <label>Salary:</label>
                <input
                  type="number"
                  value={editingEmployee.salary}
                  onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, salary: parseInt(e.target.value) } : null)}
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={editingEmployee.status}
                  onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, status: e.target.value as 'active' | 'inactive' } : null)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleCancelEdit} className="btn-secondary">Cancel</button>
              <button onClick={() => handleSaveEdit(editingEmployee)} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
