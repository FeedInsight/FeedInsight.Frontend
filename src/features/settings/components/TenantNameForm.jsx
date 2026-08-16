import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building } from 'lucide-react'
import Card from '@shared/components/ui/Card.jsx'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useAuth } from '@shared/hooks/useAuth.js'
import { useUpdateTenantCompany } from '../hooks/useTenantSettings.js'

const schema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, 'Company name is required')
    .max(100, 'Company name must not exceed 100 characters'),
})

export default function TenantNameForm() {
  const { user } = useAuth()
  const { mutate: save, isPending } = useUpdateTenantCompany()

  const currentCompanyName = user?.companyName || user?.tenantName || ''

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: currentCompanyName,
    },
  })

  useEffect(() => {
    reset({
      companyName: currentCompanyName,
    })
  }, [currentCompanyName, reset])

  const onSubmit = (values) => {
    save({ companyName: values.companyName.trim() })
  }

  return (
    <Card className="flex flex-col gap-5 border border-slate-200/80 bg-white p-6 shadow-xs rounded-2xl">
      <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
          <Building size={19} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Organization Information</h2>
          <p className="text-xs text-slate-500">Update your company name.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Company Name"
          placeholder="e.g. Acme Corp"
          error={errors.companyName?.message}
          disabled={isPending}
          {...register('companyName')}
        />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isPending}
            disabled={isPending}
            className="shadow-sm"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  )
}

