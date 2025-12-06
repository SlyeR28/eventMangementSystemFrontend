// User Roles - Must match backend Role enum
export const ROLES = {
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
    ORGANIZER: 'ORGANIZER',
    ATTENDEE: 'ATTENDEE'
};

// Role display names
export const ROLE_LABELS = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.STAFF]: 'Staff',
    [ROLES.ORGANIZER]: 'Event Organizer',
    [ROLES.ATTENDEE]: 'Attendee'
};

// Check if user has specific role
export const hasRole = (user, role) => {
    return user?.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (user, roles) => {
    return roles.includes(user?.role);
};

// Check if user is admin
export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);

// Check if user is organizer
export const isOrganizer = (user) => hasRole(user, ROLES.ORGANIZER);

// Check if user is staff
export const isStaff = (user) => hasRole(user, ROLES.STAFF);

// Check if user is attendee
export const isAttendee = (user) => hasRole(user, ROLES.ATTENDEE);

export default ROLES;
