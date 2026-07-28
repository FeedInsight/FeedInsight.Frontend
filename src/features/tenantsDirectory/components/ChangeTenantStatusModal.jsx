import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
          toast.success(`Tenant ${tenant.companyName} is ${newStatus}`)
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
      title={`${isActive ? 'Suspend' : 'Activate'} Tenant`}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="text-sm text-slate-600">
          Are you sure you want to {isActive ? 'suspend' : 'activate'}
          <strong> {tenant.companyName}</strong>?
        </p>

        <Input
          label="Reason"
          placeholder={
            isActive
              ? "e.g. Didn't pay, Violation of terms"
              : 'e.g. Payment received, Issue resolved'
          }
          disabled={toggleStatus.isPending}
          error={errors.reason?.message}
          {...register('reason')}
        />

        <div className="mt-4 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={toggleStatus.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={toggleStatus.isPending}>
            {toggleStatus.isPending ? 'Confirming...' : 'Confirm'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ChangeTenantStatusModal
