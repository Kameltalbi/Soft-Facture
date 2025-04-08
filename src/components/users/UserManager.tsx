
import { useState } from "react";
import { User, UserFormModal } from "./UserFormModal";
import { UserList } from "./UserList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface UserManagerProps {
  initialUsers?: User[];
  onUsersChange?: (users: User[]) => void;
}

export function UserManager({ initialUsers = [], onUsersChange }: UserManagerProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleUserChange = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    if (onUsersChange) {
      onUsersChange(updatedUsers);
    }
  };

  const handleAddUser = (user: User) => {
    // Dans une application réelle, l'ID serait généré par le backend
    const newUser = { ...user, id: crypto.randomUUID() };
    const updatedUsers = [...users, newUser];
    handleUserChange(updatedUsers);
    
    toast({
      title: "Utilisateur ajouté",
      description: `${user.nom} a été ajouté avec succès.`,
    });
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (!updatedUser.id) return;
    
    const updatedUsers = users.map((user) => 
      user.id === updatedUser.id ? updatedUser : user
    );
    
    handleUserChange(updatedUsers);
    
    toast({
      title: "Utilisateur mis à jour",
      description: `${updatedUser.nom} a été mis à jour avec succès.`,
    });
  };

  const handleDeleteUser = (id: string) => {
    setUserToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    
    const userToRemove = users.find(u => u.id === userToDelete);
    const updatedUsers = users.filter(user => user.id !== userToDelete);
    handleUserChange(updatedUsers);
    
    toast({
      title: "Utilisateur supprimé",
      description: userToRemove ? `${userToRemove.nom} a été supprimé avec succès.` : "L'utilisateur a été supprimé avec succès.",
    });
    
    setUserToDelete(undefined);
    setIsDeleteDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setCurrentUser(undefined);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (user: User) => {
    if (isEditing && user.id) {
      handleUpdateUser(user);
    } else {
      handleAddUser(user);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Gestion des utilisateurs</h3>
        <Button onClick={handleOpenAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      <UserList 
        users={users} 
        onEdit={handleEditUser} 
        onDelete={handleDeleteUser} 
      />

      <UserFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleFormSubmit}
        initialUser={currentUser}
        isEditing={isEditing}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cet utilisateur sera définitivement supprimé
              du système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
