import { useMemo } from "react";


interface User { id: string; permissions: Permission[]; } 

export enum Permission { 
    READ = 'read', 
    WRITE = 'write', 
    DELETE = 'delete', 
    ADMIN = 'admin', 
} 

export function usePermissionsChecker(user: User | null, requiredPermissions: Permission[]) {

    // console.log('user in hook for perms', user)

     const hasPermissions = useMemo(() => { 
        if (!user) return false; 
        return requiredPermissions.every((permission) => user.permissions.includes(permission)); }, [user, requiredPermissions]); 
        return hasPermissions; 
} 

export default usePermissionsChecker