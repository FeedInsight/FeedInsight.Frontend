import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { useCreateApiKey } from "../hooks/useAPIKeys"
import toast from "react-hot-toast"
import Modal from "@shared/components/ui/Modal"
import { AlertTriangle, Copy } from "lucide-react"
import Button from "@shared/components/ui/Button"
import Input from "@shared/components/ui/Input"

const schema = z.object({
  name: z.string().trim().min(1, 'Key name is required'),
  expiresAt: z.coerce.date({
    errorMap: () => ({ message: "Expiry date is required" })
  }).refine((date) => date > new Date(), {
    message: "Expiration date must be in the future",
  }),
})

const GenerateApiKeyModal = ({ isOpen, onClose }) => {
  const [key, setKey] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', expiresAt: '' },
  })

  const { mutate: create, isPending } = useCreateApiKey()

  const onSubmit = (data) => {
    create({
      name: data.name,
      expiresAt: new Date(data.expiresAt).toISOString(),
    },
      {
        onSuccess: (res) => {
          setKey(res?.data?.apiKey ?? null)
        },
        onError: (err) => {
          const msg = err?.response?.data?.errors?.ExpiresAt?.[0]
          toast.error(msg || 'Failed to generate API key')
        },
      })
  }

  const copyKey = async () => {
    if (!key) {
      return
    }

    await navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard')
  }

  const handleClose = () => {
    setKey(null)
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={key ? 'Your new API key' : 'Generate new API key'}
      size="md"
    >

      {key ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertTriangle size={18} className="mt-0.5 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>Copy this key now</strong>, it won't be shown again after you close this dialog
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase text-slate-500">Full API Key</p>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-950 px-3 py-2">
              <code className="flex-1 break-all text-sm text-emerald-400">{key}</code>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>
              Done
            </Button>
            <Button onClick={copyKey}>
              <Copy size={16} />
              Copy key
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Key name"
            placeholder="e.g. Production webhook"
            error={errors.name?.message}
            disabled={isPending}
            {...register('name')}
          />

          <Input
            label="Expires at"
            type="date"
            error={errors.expiresAt?.message}
            disabled={isPending}
            min={new Date().toISOString().split('T')[0]}
            {...register('expiresAt')}
          />

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              Generate key
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default GenerateApiKeyModal
