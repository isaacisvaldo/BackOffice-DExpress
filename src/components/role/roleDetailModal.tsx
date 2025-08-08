import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { Profile, Permission } from "@/services/role/role.service"

interface ProfileDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  profile: Profile | null
}

const ProfileDetailsModal = ({ isOpen, onClose, profile }: ProfileDetailsModalProps) => {
  if (!profile) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Perfil: {profile.label}</DialogTitle>
          <DialogDescription>
            Informações e permissões associadas a este perfil.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Nome Interno:</span>
            <span>{profile.label}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Descrição:</span>
            <span>{profile.description || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <span className="font-semibold">Permissões Associadas:</span>
            <ul className="list-disc pl-5">
              {profile.permissions.length > 0 ? (
                profile.permissions.map((p: Permission) => (
                  <li key={p.id}>{p.label}</li>
                ))
              ) : (
                <li>Nenhuma permissão associada.</li>
              )}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDetailsModal
