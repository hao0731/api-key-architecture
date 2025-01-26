import { Resource } from './resource';

export type BaseRoleType = 'reader' | 'writer';
export type StaticRoleType = 'admin';
export type ResourceRoleType<R extends Resource> = `${R}:${BaseRoleType}`;
export type RoleName = StaticRoleType | ResourceRoleType<Resource>;
