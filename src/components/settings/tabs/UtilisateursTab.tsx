
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { UserManager } from "@/components/users/UserManager";
import { User } from "@/components/users/UserFormModal";

interface UtilisateursTabProps {
  users: User[];
  setUsers: (users: User[]) => void;
  onSave: () => void;
}

export function UtilisateursTab({ users, setUsers, onSave }: UtilisateursTabProps) {
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
        
        <div className="flex justify-end mt-6">
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            {t('settings.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
