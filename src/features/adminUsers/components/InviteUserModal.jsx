import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserPlus, Mail, User, Shield } from 'lucide-react'
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: ROLES.VIEWER },
  })

  const onSubmit = async (values) => {
    await invite.mutateAsync(values)
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Admin User" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-1">
        <p className="text-xs text-slate-500 mb-1">
          Send an invitation email to add a new administrator or product owner to the platform.
        </p>

        <Input
          label="Full Name"
          placeholder="e.g. Jane Doe"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="jane.doe@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Assign Role
          </label>
          <div className="relative">
            <select
              {...register('role')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
            >
              {Object.values(ROLES).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={invite.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={invite.isPending}
            loadingText="Sending Invite..."
            className="shadow-md shadow-brand-500/20"
          >
            <UserPlus size={16} />
            <span>Send Invitation</span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}

