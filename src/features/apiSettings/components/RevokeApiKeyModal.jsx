import toast from "react-hot-toast"
import { useRevokeApiKey } from "../hooks/useAPIKeys"
import Modal from "@shared/components/ui/Modal"
import Button from "@shared/components/ui/Button"

const RevokeApiKeyModal = ({ isOpen, onClose, apiKey }) => {
  const { mutate: revoke, isPending } = useRevokeApiKey()

  if (!apiKey) {
    return null
  }

  const handleRevoke = () => {
    revoke(apiKey.id, {
      onSuccess: () => {
        onClose()
        toast.success('API key revoked successfully')
      },
      onError: (err) => {
        const msg = err?.message || 'Failed to revoke key'
        toast.error(msg)
      }
    })
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Revoke API key" size="sm">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-md text-slate-900 mb-2">
            Are you sure you want to revoke the API key
            <strong className="text-slate-900"> {apiKey.name}</strong>?
          </p>

          <p className="text-sm text-slate-600">
            Any applications using this key will lose access
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleRevoke}
            isLoading={isPending}
          >
            Revoke key
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default RevokeApiKeyModal
