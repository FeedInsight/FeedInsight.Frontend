import z from 'zod'
import { useUpdateTenantCompany, useTenantSettings } from '../hooks/useTenantSettings.js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import Card from '@shared/components/ui/Card.jsx'
import { Building } from 'lucide-react'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useAuth } from '@shared/hooks/useAuth.js'

const schema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required'),
})

export default function TenantNameForm({ companyName: initialCompanyName = '' }) {
  const { user } = useAuth()
  const { data: tenantData, isLoading: isLoadingSettings } = useTenantSettings()
  const { mutate: save, isPending } = useUpdateTenantCompany()

  const currentCompanyName =
    tenantData?.companyName ||
    tenantData?.name ||
    user?.companyName ||
    user?.tenantName ||
    initialCompanyName ||
    ''

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { companyName: currentCompanyName },
  })

  useEffect(() => {
    if (currentCompanyName) {
      reset({ companyName: currentCompanyName })
    }
  }, [currentCompanyName, reset])

  const onSubmit = (values) => {
    save({ companyName: values.companyName.trim() })
  }

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50">
          <Building size={18} className="text-brand-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Organization & Tenant Information</h2>
          <p className="text-sm text-slate-500">Update your company name for this tenant organization</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Company / Tenant Name"
          placeholder="e.g. Acme Corp"
          error={errors.companyName?.message}
          disabled={isPending || isLoadingSettings}
          {...register('companyName')}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            disabled={isPending || isLoadingSettings}
          >
            Save company changes
          </Button>
        </div>
      </form>
    </Card>
  )
}
