import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@shared/components/ui/Modal.jsx'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { ROLES } from '@app/config/constants.js'
import { useAdminUserMutations } from '@features/adminUsers/hooks/useAdminUsers.js'

const schema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  role: z.enum(Object.values(ROLES)),
})

export default function InviteUserModal({ isOpen, onClose }) {
  const { invite } = useAdminUserMutations()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: ROLES.VIEWER },
  })

  const onSubmit = async (values) => {
    await invite.mutateAsync(values)
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite admin user">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Full name" error={errors.fullName?.message} {...register('fullName')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Role</label>
          <select {...register('role')} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            {Object.values(ROLES).map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={invite.isPending}>Send invite</Button>
        </div>
      </form>
    </Modal>
  )
}
