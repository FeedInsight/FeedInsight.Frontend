import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertTriangle, Ban, CheckCircle, ShieldAlert } from 'lucide-react'
import { useTenantMutations } from '../hooks/useTenants'
import Modal from '@shared/components/ui/Modal'
import Input from '@shared/components/ui/Input'
import Button from '@shared/components/ui/Button'
import toast from 'react-hot-toast'

const schema = z.object({
  reason: z.string().trim().min(1, 'Reason is required'),
})

const ChangeTenantStatusModal = ({ isOpen, onClose, tenant }) => {
  const { toggleStatus } = useTenantMutations()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { reason: '' },
  })

  useEffect(() => {
    if (isOpen) {
      reset()
    }
  }, [isOpen, reset])

  if (!tenant) {
    return null
  }

  const isActive = tenant.status === 'Active'
  const newStatus = isActive ? 'Suspended' : 'Active'
  const newStatusCode = isActive ? 1 : 0

  const onSubmit = (data) => {
    toggleStatus.mutate(
      {
        tenantId: tenant.id,
        status: newStatusCode,
        reason: data.reason,
      },
      {
        onSuccess: () => {
          toast.success(`Tenant ${tenant.companyName} is now ${newStatus}`)
          onClose()
        },
        onError: (err) => {
          const msg = err?.message || 'Failed to update status'
          toast.error(msg)
        },
      },
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isActive ? 'Suspend' : 'Activate'} Tenant Account`}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-1">
        <div
          className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${
            isActive
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {isActive ? (
            <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          )}
          <span>
            {isActive
              ? `Suspending ${tenant.companyName} will restrict access for all associated users under this tenant.`
              : `Activating ${tenant.companyName} will restore normal access for all associated users.`}
          </span>
        </div>

        <Input
          label="Reason for Status Change"
          placeholder={
            isActive
              ? "e.g. Subscription lapsed, Terms violation"
              : 'e.g. Payment confirmed, Account verified'
          }
          disabled={toggleStatus.isPending}
          error={errors.reason?.message}
          {...register('reason')}
        />

        <div className="mt-3 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={toggleStatus.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={isActive ? 'danger' : 'success'}
            size="md"
            isLoading={toggleStatus.isPending}
            loadingText={isActive ? 'Suspending...' : 'Activating...'}
            className={isActive ? 'shadow-md shadow-red-500/20' : 'shadow-md shadow-emerald-500/20'}
          >
            {isActive ? <Ban size={15} /> : <CheckCircle size={15} />}
            <span>Confirm {isActive ? 'Suspension' : 'Activation'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ChangeTenantStatusModal

