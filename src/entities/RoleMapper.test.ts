import { LegacyRole, Role } from './User';
import { RoleMapper } from './RoleMapper';

const roleMapper = new RoleMapper();

describe('RoleMapper.getRoleByLegacyRole()', () => {
  type Roles = Role | LegacyRole;
  const mappings: Array<{ input: Roles; output: Roles }> = [
    {
      input: 'ROLE_ABS_ADMIN',
      output: 'ROLE_ABS_ADMIN',
    },
    {
      input: 'ROLE_ABS_OFFICE',
      output: 'ROLE_ABS_OFFICE',
    },
    {
      input: 'ROLE_COMPANY_TECH',
      output: 'ROLE_COMPANY_TECH',
    },
    {
      input: 'ROLE_COMPANY_ADMIN',
      output: 'ROLE_COMPANY_ADMIN',
    },
    {
      input: 'ROLE_SUPER_ADMIN',
      output: 'ROLE_ABS_ADMIN',
    },
    {
      input: 'ROLE_ADMIN',
      output: 'ROLE_COMPANY_ADMIN',
    },
    {
      input: 'ROLE_COMPANY_OFFICE',
      output: 'ROLE_COMPANY_ADMIN',
    },
    {
      input: 'ROLE_USER',
      output: 'ROLE_COMPANY_TECH',
    },
  ];

  for (const mapping of mappings) {
    it('Should map a legacy role to a role.', () => {
      expect(roleMapper.getRoleByLegacyRole(mapping.input)).toStrictEqual(mapping.output);
    });
  }
});

describe('RoleMapper.getRolesByRole()', () => {
  it('should return role stack for ROLE_COMPANY_TECH by default', () => {
    expect(roleMapper.getRolesByRole(undefined)).toEqual(
      expect.arrayContaining(roleMapper.ROLE_COMPANY_TECH)
    );
    expect(roleMapper.getRolesByRole('ROLE_COMPANY_TECH')).toEqual(
      expect.arrayContaining(roleMapper.ROLE_COMPANY_TECH)
    );
  });

  it('should return role stack for ROLE_ABS_ADMIN', () => {
    const expectedResult = new Set(
      roleMapper.ROLE_ABS_ADMIN.concat(
        roleMapper.ROLE_COMPANY_ADMIN,
        roleMapper.ROLE_ABS_OFFICE,
        roleMapper.ROLE_COMPANY_TECH
      )
    );

    expect(roleMapper.getRolesByRole('ROLE_ABS_ADMIN')).toEqual(
      expect.arrayContaining(Array.from(expectedResult))
    );
  });

  it('should return role stack for ROLE_ABS_OFFICE', () => {
    const expectedResult = new Set(
      roleMapper.ROLE_ABS_OFFICE.concat(roleMapper.ROLE_COMPANY_ADMIN, roleMapper.ROLE_COMPANY_TECH)
    );

    expect(roleMapper.getRolesByRole('ROLE_ABS_OFFICE')).toEqual(
      expect.arrayContaining(Array.from(expectedResult))
    );
  });

  it('should return role stack for ROLE_COMPANY_ADMIN', () => {
    const expectedResult = new Set(
      roleMapper.ROLE_COMPANY_ADMIN.concat(roleMapper.ROLE_COMPANY_TECH)
    );

    expect(roleMapper.getRolesByRole('ROLE_COMPANY_ADMIN')).toEqual(
      expect.arrayContaining(Array.from(expectedResult))
    );
  });
});
