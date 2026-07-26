import { useState } from 'react'
import { UserX, Plus } from 'lucide-react'
import Table from '@shared/components/ui/Table.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import { ADMIN_ROLES } from '@app/config/constants.js'
import { useAdminUsers, useAdminUserMutations } from '@features/adminUsers/hooks/useAdminUsers.js'
import InviteUserModal from './InviteUserModal.jsx'

/**
 * Table of ADMINUSERS rows for the current tenant, only reachable via
 * CAN_MANAGE_ADMIN_USERS (Owner role) per router/AppRouter.jsx's
 * ProtectedRoute gating. Role changes use a plain <select> rather than a
 * modal since it's a single-field edit.
 */
export default function AdminUserTable() {
  const { data: users = [] } = useAdminUsers()
  const { updateRole, deactivate } = useAdminUserMutations()
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setIsInviteOpen(true)}>
          <Plus size={16} /> Invite user
        </Button>
      </div>

      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell as="th">Name</Table.Cell>
            <Table.Cell as="th">Email</Table.Cell>
            <Table.Cell as="th">Role</Table.Cell>
            <Table.Cell as="th">Status</Table.Cell>
            <Table.Cell as="th" className="text-right">Actions</Table.Cell>
          </Table.Row>
        </Table.Head>
        <tbody>
          {users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell className="font-medium">{user.fullName}</Table.Cell>
              <Table.Cell className="text-slate-500">{user.email}</Table.Cell>
              <Table.Cell>
                <select
                  value={user.role}
                  onChange={(e) => updateRole.mutate({ id: user.id, role: e.target.value })}
                  className="rounded border border-slate-200 px-2 py-1 text-xs"
                >
                  {Object.values(ADMIN_ROLES).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </Table.Cell>
              <Table.Cell>
                <Badge className={user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}>
                  {user.isActive ? 'Active' : 'Pending'}
                </Badge>
              </Table.Cell>
              <Table.Cell className="text-right">
                <button onClick={() => deactivate.mutate(user.id)} aria-label="Deactivate user">
                  <UserX size={16} className="text-slate-400 hover:text-red-600" />
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </tbody>
      </Table>

      <InviteUserModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  )
}
