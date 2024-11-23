
// components/AddressDisplay.tsx
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AddressDisplay = ({ addresses, onAddressDeleted }) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const handleDeleteClick = (address) => {
    setAddressToDelete(address);
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteAddress(addressToDelete.id);
      
      if (response.success) {
        toast({
          title: "Address deleted",
          description: "The address has been successfully removed.",
        });
        onAddressDeleted?.(addressToDelete.id);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to delete address",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsDeleting(false);
      setAddressToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setAddressToDelete(null);
  };

  return (
    <>
      <div className="space-y-4">
        {addresses?.map((address) => (
          <Card key={address.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div className="space-y-1">
                    {address.isDefault && (
                      <Badge variant="secondary" className="mb-2">
                        Default Address
                      </Badge>
                    )}
                    <p className="font-medium text-lg">{address.street}</p>
                    <p className="text-muted-foreground">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-muted-foreground">{address.country}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(address)}
                    className="hover:bg-secondary"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="sr-only">Edit address</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(address)}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                    disabled={isDeleting}
                  >
                    <Trash className="w-4 h-4" />
                    <span className="sr-only">Delete address</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!addressToDelete} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this address. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddressDisplay;