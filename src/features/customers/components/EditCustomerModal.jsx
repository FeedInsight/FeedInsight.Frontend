import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@shared/components/ui/Modal.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Input from '@shared/components/ui/Input.jsx'
import { useUpdateCustomer } from '../hooks/useCustomers.js'

const schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
})

export default function EditCustomerModal({ isOpen, onClose, customer }) {
  const { mutate: update, isPending } = useUpdateCustomer()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  })

  useEffect(() => {
    if (customer) {
      reset({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
      })
    }
  }, [customer, reset])

  const onSubmit = (values) => {
    if (!customer) return
    const id = customer.id || customer.userId || customer.customerId
    update(
      { id, ...values },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Customer Details" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="First name"
            disabled={isPending}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Last name"
            disabled={isPending}
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="customer@example.com"
          disabled={isPending}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isPending} disabled={isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}
