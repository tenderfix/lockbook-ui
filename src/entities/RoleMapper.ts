import { LegacyRole, Role } from './User';

export class RoleMapper extends Array<Role> {
  ROLE_ABS_ADMIN: Role[] = ['ROLE_ABS_ADMIN', 'ROLE_ABS_OFFICE', 'ROLE_COMPANY_ADMIN'];
  ROLE_ABS_OFFICE: Role[] = ['ROLE_ABS_OFFICE', 'ROLE_COMPANY_ADMIN'];
  ROLE_COMPANY_ADMIN: Role[] = ['ROLE_COMPANY_ADMIN', 'ROLE_COMPANY_TECH'];
  ROLE_COMPANY_TECH: Role[] = ['ROLE_COMPANY_TECH'];

  getRoleByLegacyRole(role: Role | LegacyRole): Role {
    switch (role) {
      case 'ROLE_SUPER_ADMIN':
        return 'ROLE_ABS_ADMIN';
      case 'ROLE_ADMIN':
        return 'ROLE_COMPANY_ADMIN';
      case 'ROLE_COMPANY_OFFICE':
        return 'ROLE_COMPANY_ADMIN';
      case 'ROLE_USER':
        return 'ROLE_COMPANY_TECH';
      default:
        return role in this ? (role as Role) : 'ROLE_COMPANY_TECH';
    }
  }

  getRolesByRole(role?: Role): Role[] {
    if (role === undefined) {
      return this.ROLE_COMPANY_TECH;
    }

    if (!(role in this)) {
      role = this.getRoleByLegacyRole(role);
    }

    const result: Set<Role> = new Set(this[role]);

    result.forEach((base) => {
      if (base in this) {
        this[base].reduce((set, val) => set.add(val), result);
      }
    });

    return Array.from(result);
  }
}
