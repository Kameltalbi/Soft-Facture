
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserPermissions } from "@/types/permissions";
import { PermissionsTab } from "./PermissionsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type User = {
  id?: string;
  nom: string;
  email: string;
  telephone: string;
  motDePasse: string;
  permissions?: UserPermissions;
};

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (user: User) => void;
  initialUser?: User;
  isEditing?: boolean;
}

export function UserFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialUser,
  isEditing = false,
}: UserFormModalProps) {
  const defaultUser: User = {
    nom: "",
    email: "",
    telephone: "",
    motDePasse: "",
    permissions: {},
  };

  const [user, setUser] = useState<User>(initialUser || defaultUser);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handlePermissionsChange = (permissions: UserPermissions) => {
    setUser((prevUser) => ({ ...prevUser, permissions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!user.nom.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom est requis",
        variant: "destructive",
      });
      return;
    }

    if (!user.email.trim() || !user.email.includes("@")) {
      toast({
        title: "Erreur de validation",
        description: "Adresse email invalide",
        variant: "destructive",
      });
      return;
    }

    if (!isEditing && !user.motDePasse.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le mot de passe est requis",
        variant: "destructive",
      });
      return;
    }

    onSubmit(user);
    onOpenChange(false);

    // Réinitialiser le formulaire si ce n'est pas une édition
    if (!isEditing) {
      setUser(defaultUser);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifiez les informations de l'utilisateur ci-dessous."
                : "Ajoutez les informations de l'utilisateur ci-dessous."}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="profile" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom complet</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={user.nom}
                  onChange={handleChange}
                  placeholder="Nom complet"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  value={user.telephone}
                  onChange={handleChange}
                  placeholder="+216 XX XXX XXX"
                />
              </div>
              {!isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="motDePasse">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="motDePasse"
                      name="motDePasse"
                      type={showPassword ? "text" : "password"}
                      value={user.motDePasse}
                      onChange={handleChange}
                      placeholder="Mot de passe"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="permissions">
              <PermissionsTab 
                permissions={user.permissions || {}}
                onChange={handlePermissionsChange}
              />
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button type="submit">
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
