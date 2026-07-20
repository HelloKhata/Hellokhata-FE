export type PlatformRole =
  | 'SUPER_ADMIN'
  | 'OPERATIONS'
  | 'DATA_STEWARD'
  | 'SUPPORT'
  | 'ANALYST'
  | 'AUDITOR';

export type PlatformPermission =
  | 'PLATFORM_DASHBOARD_READ'
  | 'PLATFORM_TENANT_READ'
  | 'PLATFORM_SUPPORT_READ'
  | 'DATASET_READ'
  | 'DATASET_WRITE'
  | 'DATASET_REVIEW'
  | 'ENTITY_ALIAS_READ'
  | 'ENTITY_ALIAS_WRITE'
  | 'ENTITY_ALIAS_APPROVE'
  | 'PLATFORM_AUDIT_READ';

export type PlatformPrincipal = {
  id: string;
  email: string;
  displayName: string | null;
  role: PlatformRole;
  permissions: PlatformPermission[];
};

export type PlatformSessionResponse = {
  data: {
    principal: PlatformPrincipal;
    expiresInSeconds?: number;
  };
};
