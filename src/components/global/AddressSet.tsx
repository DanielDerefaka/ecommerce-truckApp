
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Check, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getAddress } from '@/lib/queries';
import { toast } from '@/hooks/use-toast';
import { AddressModal } from './site/AddressModal';
import { Address } from '@prisma/client';

const AddressSelector = ({onAddressSelect}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await getAddress();
      
      if (response.success && response.addresses) {
        setAddresses(response.addresses);
        // Select default address if available
        const defaultAddress = response.addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        }
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load addresses",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAddressSelect = async (addressId:string) => {
    setSelectedAddress(addressId);
    // Find the selected address object and pass it to parent
    const selectedAddr = addresses.find(addr => addr.id === addressId);
    if (selectedAddr) {
      onAddressSelect(selectedAddr);
    }
  };

  const AddressCard = ({ address }: { address: Address }) => (
    <Card className="p-6 hover:bg-accent/50 transition-colors">
      <div className="flex items-center space-x-4">
        <RadioGroupItem value={address.id} id={address.id} />
        <Label htmlFor={address.id} className="flex-1 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <div>
                <h2 className="font-semibold">{address.name || 'Default Address'}</h2>
                <p className="text-sm text-muted-foreground">
                  {address.street}, {address.city}, {address.state} {address.postalCode}
                </p>
                {address.isDefault && (
                  <span className="text-xs text-primary">Default Address</span>
                )}
              </div>
            </div>
            {selectedAddress === address.id && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </div>
        </Label>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <div>
                <h2 className="font-semibold">No addresses saved</h2>
                <p className="text-sm text-muted-foreground">
                  Add your first delivery address
                </p>
              </div>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add new address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <AddressModal
                open={open}
                setOpen={setOpen}
                onAddressAdd={fetchAddresses}
              />
            </DialogContent>
          </Dialog>
        </Card>
      ) : (
        <>
          <RadioGroup
            value={selectedAddress}
            onValueChange={handleAddressSelect}
            className="space-y-4"
          >
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </RadioGroup>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add another address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <AddressModal
                open={open}
                setOpen={setOpen}
                onAddressAdd={fetchAddresses}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default AddressSelector;