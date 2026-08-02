import z from "zod"
import { useUpdateTenantProfile } from "../hooks/useProfile"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import Card from "@shared/components/ui/Card"
import { Building } from "lucide-react"
import Input from "@shared/components/ui/Input"
import Button from "@shared/components/ui/Button"

const schema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required'),
})

const TenantNameForm = ({ companyName = '' }) => {
  const { mutate: save, isPending } = useUpdateTenantProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { companyName },
  })

  useEffect(() => {
    reset({ companyName })
  }, [companyName, reset])

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50">
          <Building size={18} className="text-brand-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Company Information</h2>
          <p className="text-sm text-slate-500">Update your company name</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((values) => save(values))}
        className="flex flex-col gap-4"
      >
        <Input
          label="Company Name"
          placeholder="e.g. FeedInsight"
          error={errors.companyName?.message}
          disabled={isPending}
          {...register('companyName')}
        />

        <div className="flex justify-end">
          <Button type="submit" isLoading={isPending}>
            Save company changes
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default TenantNameForm
