import { RoleName } from '../types';

export const checkRoleNameFormat = (roleName: string): roleName is RoleName => {
  const regExp = /^(admin|(\w+):writer|(\w+):reader)$/;
  return regExp.test(roleName);
};
