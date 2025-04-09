
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { UserManager } from "@/components/users/UserManager";
import { User } from "@/components/users/UserFormModal";

interface UtilisateursTabProps {
  users: User[];
  setUsers: (users: User[]) => void;
  onSave: () => void;
  onCancel?: () => void;
}

export function UtilisateursTab({ users, setUsers, onSave, onCancel }: UtilisateursTabProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.userManagement')}</CardTitle>
        <CardDescription>
          {t('settings.userManagementDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserManager 
          initialUsers={users}
          onUsersChange={setUsers}
        />
        
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={onCancel || (() => {})}
          >
            <X className="mr-2 h-4 w-4" />
            {t('common.cancel')}
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            {t('settings.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
