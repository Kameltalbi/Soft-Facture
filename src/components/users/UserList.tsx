
import { User } from "./UserFormModal";
import { Edit, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UserList({ users, onEdit, onDelete }: UserListProps) {
  // Count permissions for a user
  const countPermissions = (user: User) => {
    if (!user.permissions) return 0;
    return Object.entries(user.permissions).filter(([_, value]) => value).length;
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Aucun utilisateur n'a été ajouté
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id || user.email}
          className="flex items-center justify-between p-3 border rounded-md"
        >
          <div className="space-y-1">
            <div className="font-medium flex items-center gap-2">
              {user.nom}
              {countPermissions(user) > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="ml-2 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        <span>{countPermissions(user)} permissions</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cet utilisateur a {countPermissions(user)} permissions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            {user.telephone && (
              <div className="text-sm text-muted-foreground">
                {user.telephone}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(user)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => user.id && onDelete(user.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
