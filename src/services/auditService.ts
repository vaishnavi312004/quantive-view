export interface AuditEntry {
  id: string;
  action: string;
  detail: string;
  timestamp: Date;
}

let auditLog: AuditEntry[] = [];

export const addAuditLog = (action: string, detail: string) => {
  auditLog.unshift({
    id: crypto.randomUUID(),
    action,
    detail,
    timestamp: new Date(),
  });
  if (auditLog.length > 100) auditLog = auditLog.slice(0, 100);
};

export const getAuditLog = () => [...auditLog];
