const allRoles = {
  user: ['manageNotification'],
  admin: ['getUsers', 'manageUsers', 'managePollution', 'manageNotification'],
  mod: ['manageNotification', 'managePollution']
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
