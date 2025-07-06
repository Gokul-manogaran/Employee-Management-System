const { db } = require('../database/schema');
const { login, registerUser } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Helper function to build WHERE clause for filters
const buildWhereClause = (filters) => {
    const conditions = [];
    const params = [];

    if (filters) {
        if (filters.name) {
            conditions.push('name LIKE ?');
            params.push(`%${filters.name}%`);
        }
        if (filters.class) {
            conditions.push('class LIKE ?');
            params.push(`%${filters.class}%`);
        }
        if (filters.minAge) {
            conditions.push('age >= ?');
            params.push(filters.minAge);
        }
        if (filters.maxAge) {
            conditions.push('age <= ?');
            params.push(filters.maxAge);
        }
        if (filters.minAttendance) {
            conditions.push('attendance >= ?');
            params.push(filters.minAttendance);
        }
        if (filters.maxAttendance) {
            conditions.push('attendance <= ?');
            params.push(filters.maxAttendance);
        }
    }

    return {
        whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
        params
    };
};

// Helper function to build ORDER BY clause
const buildOrderClause = (sortBy = 'name', sortOrder = 'ASC') => {
    const validSortFields = ['name', 'age', 'class', 'attendance', 'created_at'];
    const validSortOrders = ['ASC', 'DESC'];

    const field = validSortFields.includes(sortBy) ? sortBy : 'name';
    const order = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    return `ORDER BY ${field} ${order}`;
};

// Helper function to parse subjects string to array
const parseSubjects = (subjects) => {
    return subjects ? subjects.split(',').map(s => s.trim()) : [];
};

// Helper function to format subjects array to string
const formatSubjects = (subjects) => {
    return subjects && subjects.length > 0 ? subjects.join(',') : '';
};

const resolvers = {
    Query: {
        // Get current user
        me: (parent, args, context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            return context.user;
        },

        // Get employees with pagination and filters
        employees: async (parent, { filters, pagination = {} }) => {
            const { offset = 0, limit = 10, sortBy, sortOrder } = pagination;
            const { whereClause, params } = buildWhereClause(filters);
            const orderClause = buildOrderClause(sortBy, sortOrder);

            return new Promise((resolve, reject) => {
                // Get total count
                db.get(
                    `SELECT COUNT(*) as count FROM employees ${whereClause}`,
                    params,
                    (err, countResult) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const totalCount = countResult.count;
                        const totalPages = Math.ceil(totalCount / limit);
                        const currentPage = Math.floor(offset / limit) + 1;

                        // Get paginated results
                        db.all(
                            `SELECT * FROM employees ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
                            [...params, limit, offset],
                            (err, rows) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                const employees = rows.map(row => ({
                                    ...row,
                                    subjects: parseSubjects(row.subjects),
                                    createdAt: row.created_at,
                                    updatedAt: row.updated_at
                                }));

                                resolve({
                                    employees,
                                    totalCount,
                                    hasNextPage: currentPage < totalPages,
                                    hasPreviousPage: currentPage > 1,
                                    currentPage,
                                    totalPages
                                });
                            }
                        );
                    }
                );
            });
        },

        // Get single employee
        employee: (parent, { id }) => {
            return new Promise((resolve, reject) => {
                db.get(
                    'SELECT * FROM employees WHERE id = ?',
                    [id],
                    (err, row) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (!row) {
                            resolve(null);
                            return;
                        }
                        resolve({
                            ...row,
                            subjects: parseSubjects(row.subjects),
                            createdAt: row.created_at,
                            updatedAt: row.updated_at
                        });
                    }
                );
            });
        },

        // Admin only: Get all employees without filters
        allEmployees: async (parent, { pagination = {} }, context) => {
            // Check if user is authenticated and has admin role
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Admin access required');
            }

            const { offset = 0, limit = 10, sortBy, sortOrder } = pagination;
            const orderClause = buildOrderClause(sortBy, sortOrder);

            return new Promise((resolve, reject) => {
                db.get(
                    'SELECT COUNT(*) as count FROM employees',
                    [],
                    (err, countResult) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const totalCount = countResult.count;
                        const totalPages = Math.ceil(totalCount / limit);
                        const currentPage = Math.floor(offset / limit) + 1;

                        db.all(
                            `SELECT * FROM employees ${orderClause} LIMIT ? OFFSET ?`,
                            [limit, offset],
                            (err, rows) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                const employees = rows.map(row => ({
                                    ...row,
                                    subjects: parseSubjects(row.subjects),
                                    createdAt: row.created_at,
                                    updatedAt: row.updated_at
                                }));

                                resolve({
                                    employees,
                                    totalCount,
                                    hasNextPage: currentPage < totalPages,
                                    hasPreviousPage: currentPage > 1,
                                    currentPage,
                                    totalPages
                                });
                            }
                        );
                    }
                );
            });
        },

        // Admin only: Get employee statistics
        employeeStats: (parent, args, context) => {
            // Check if user is authenticated and has admin role
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Admin access required');
            }

            return new Promise((resolve, reject) => {
                db.get(
                    'SELECT COUNT(*) as total, AVG(age) as avgAge, AVG(attendance) as avgAttendance FROM employees',
                    [],
                    (err, stats) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        // Get class distribution
                        db.all(
                            'SELECT class, COUNT(*) as count FROM employees WHERE class IS NOT NULL GROUP BY class',
                            [],
                            (err, classDistribution) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                resolve({
                                    totalEmployees: stats.total,
                                    averageAge: Math.round(stats.avgAge * 100) / 100,
                                    averageAttendance: Math.round(stats.avgAttendance * 100) / 100,
                                    classDistribution: classDistribution.map(c => ({
                                        class: c.class,
                                        count: c.count
                                    }))
                                });
                            }
                        );
                    }
                );
            });
        }
    },

    Mutation: {
        // Login mutation
        login: async (parent, { username, password }) => {
            try {
                const result = await login(username, password);
                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        // Register mutation (admin only)
        register: async (parent, { username, email, password, role }, context) => {
            // Check if user is authenticated and has admin role
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Admin access required');
            }

            try {
                const user = await registerUser({ username, email, password, role });
                const result = await login(username, password);
                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        // Create employee (admin only)
        createEmployee: async (parent, { input }, context) => {
            // Check if user is authenticated and has admin role
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Admin access required');
            }

            const { name, age, class: className, subjects, attendance = 0 } = input;
            const employeeId = uuidv4();
            const userId = uuidv4();
            const formattedSubjects = formatSubjects(subjects);

            return new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO employees (id, name, age, class, subjects, attendance, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [employeeId, name, age, className, formattedSubjects, attendance, userId],
                    function (err) {
                        if (err) {
                            reject(new Error('Failed to create employee'));
                            return;
                        }

                        // Return the created employee
                        db.get(
                            'SELECT * FROM employees WHERE id = ?',
                            [employeeId],
                            (err, row) => {
                                if (err) {
                                    reject(new Error('Failed to retrieve created employee'));
                                    return;
                                }

                                resolve({
                                    success: true,
                                    message: 'Employee created successfully',
                                    employee: {
                                        ...row,
                                        subjects: parseSubjects(row.subjects),
                                        createdAt: row.created_at,
                                        updatedAt: row.updated_at
                                    }
                                });
                            }
                        );
                    }
                );
            });
        },

        // Update employee (admin only)
        updateEmployee: async (parent, { id, input }, context) => {
            // Check if user is authenticated and has admin role
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Admin access required');
            }

            const { name, age, class: className, subjects, attendance } = input;
            const formattedSubjects = formatSubjects(subjects);

            return new Promise((resolve, reject) => {
                // Build dynamic update query
                const updates = [];
                const params = [];

                if (name !== undefined) {
                    updates.push('name = ?');
                    params.push(name);
                }
                if (age !== undefined) {
                    updates.push('age = ?');
                    params.push(age);
                }
                if (className !== undefined) {
                    updates.push('class = ?');
                    params.push(className);
                }
                if (subjects !== undefined) {
                    updates.push('subjects = ?');
                    params.push(formattedSubjects);
                }
                if (attendance !== undefined) {
                    updates.push('attendance = ?');
                    params.push(attendance);
                }

                if (updates.length === 0) {
                    reject(new Error('No fields to update'));
                    return;
                }

                updates.push('updated_at = CURRENT_TIMESTAMP');
                params.push(id);

                db.run(
                    `UPDATE employees SET ${updates.join(', ')} WHERE id = ?`,
                    params,
                    function (err) {
                        if (err) {
                            reject(new Error('Failed to update employee'));
                            return;
                        }

                        if (this.changes === 0) {
                            reject(new Error('Employee not found'));
                            return;
                        }

                        // Return the updated employee
                        db.get(
                            'SELECT * FROM employees WHERE id = ?',
                            [id],
                            (err, row) => {
                                if (err) {
                                    reject(new Error('Failed to retrieve updated employee'));
                                    return;
                                }

                                resolve({
                                    success: true,
                                    message: 'Employee updated successfully',
                                    employee: {
                                        ...row,
                                        subjects: parseSubjects(row.subjects),
                                        createdAt: row.created_at,
                                        updatedAt: row.updated_at
                                    }
                                });
                            }
                        );
                    }
                );
            });
        },

        // Delete employee (admin only)
        deleteEmployee: async (parent, { id }, context) => {
            // Check if user is authenticated and has admin role
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Admin access required');
            }

            return new Promise((resolve, reject) => {
                db.run(
                    'DELETE FROM employees WHERE id = ?',
                    [id],
                    function (err) {
                        if (err) {
                            reject(new Error('Failed to delete employee'));
                            return;
                        }

                        if (this.changes === 0) {
                            reject(new Error('Employee not found'));
                            return;
                        }

                        resolve({
                            success: true,
                            message: 'Employee deleted successfully',
                            employee: null
                        });
                    }
                );
            });
        },

        // Employee self-update (limited fields)
        updateMyProfile: async (parent, { input }, context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }

            // Find employee by user ID
            return new Promise((resolve, reject) => {
                db.get(
                    'SELECT * FROM employees WHERE user_id = ?',
                    [context.user.id],
                    (err, employee) => {
                        if (err) {
                            reject(new Error('Failed to find employee profile'));
                            return;
                        }

                        if (!employee) {
                            reject(new Error('Employee profile not found'));
                            return;
                        }

                        // Only allow updating certain fields for self-update
                        const { name, age, subjects } = input;
                        const formattedSubjects = formatSubjects(subjects);

                        const updates = [];
                        const params = [];

                        if (name !== undefined) {
                            updates.push('name = ?');
                            params.push(name);
                        }
                        if (age !== undefined) {
                            updates.push('age = ?');
                            params.push(age);
                        }
                        if (subjects !== undefined) {
                            updates.push('subjects = ?');
                            params.push(formattedSubjects);
                        }

                        if (updates.length === 0) {
                            reject(new Error('No fields to update'));
                            return;
                        }

                        updates.push('updated_at = CURRENT_TIMESTAMP');
                        params.push(employee.id);

                        db.run(
                            `UPDATE employees SET ${updates.join(', ')} WHERE id = ?`,
                            params,
                            function (err) {
                                if (err) {
                                    reject(new Error('Failed to update profile'));
                                    return;
                                }

                                // Return the updated employee
                                db.get(
                                    'SELECT * FROM employees WHERE id = ?',
                                    [employee.id],
                                    (err, row) => {
                                        if (err) {
                                            reject(new Error('Failed to retrieve updated profile'));
                                            return;
                                        }

                                        resolve({
                                            success: true,
                                            message: 'Profile updated successfully',
                                            employee: {
                                                ...row,
                                                subjects: parseSubjects(row.subjects),
                                                createdAt: row.created_at,
                                                updatedAt: row.updated_at
                                            }
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            });
        }
    }
};

module.exports = resolvers; 