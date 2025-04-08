
import { availablePermissions, groupedPermissions } from "./permissions/permissionsData";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserPermissions } from "@/types/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment } from "react";

interface PermissionsTabProps {
  permissions: UserPermissions;
  onChange: (permissions: UserPermissions) => void;
}

export function PermissionsTab({ permissions, onChange }: PermissionsTabProps) {
  // Map resource names to French names
  const resourceLabels: Record<string, string> = {
    factures: "Factures",
    devis: "Devis",
    bonDeSortie: "Bons de Sortie",
    clients: "Clients",
    produits: "Produits",
    categories: "Catégories",
    parametres: "Paramètres"
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const updatedPermissions = { ...permissions, [permissionId]: checked };
    onChange(updatedPermissions);
  };

  // Handle "select all" for a resource
  const handleSelectAllForResource = (resource: string, checked: boolean) => {
    const resourcePermissions = groupedPermissions[resource];
    const updatedPermissions = { ...permissions };
    
    resourcePermissions.forEach(permission => {
      updatedPermissions[permission.id] = checked;
    });
    
    onChange(updatedPermissions);
  };

  return (
    <div className="space-y-4 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Permissions utilisateur</CardTitle>
          <CardDescription>
            Définissez les permissions accordées à cet utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <Accordion type="multiple" className="w-full">
              {Object.keys(groupedPermissions).map((resource) => (
                <AccordionItem key={resource} value={resource}>
                  <AccordionTrigger className="text-base">
                    {resourceLabels[resource] || resource}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center space-x-2 pb-2 border-b mb-2">
                        <Checkbox 
                          id={`select-all-${resource}`}
                          checked={groupedPermissions[resource].every(p => permissions[p.id])}
                          onCheckedChange={(checked) => 
                            handleSelectAllForResource(resource, checked === true)
                          }
                        />
                        <Label 
                          htmlFor={`select-all-${resource}`}
                          className="font-medium"
                        >
                          Sélectionner tout
                        </Label>
                      </div>
                      
                      {groupedPermissions[resource].map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox 
                            id={permission.id}
                            checked={permissions[permission.id] || false}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked === true)
                            }
                          />
                          <div className="grid gap-1.5">
                            <Label 
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none"
                            >
                              {permission.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
