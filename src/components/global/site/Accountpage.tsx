"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  MapPin,
  Globe,
  Package,
  Settings,
  User,
  Edit,
  Trash,
  Plus,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { DeleteAddress, getUserDetails } from "@/lib/queries";
import { redirect } from "next/navigation";
import { type UserWithDetails } from "@/lib/types"; // You'll need to export the type from your actions file
import Loading from "../Loading";
import LoadingPage from "../loading-page";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddressModal } from "./AddressModal";

export default function AccountPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState<UserWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchUserDetails() {
      if (!clerkUser) return;

      try {
        const response = await getUserDetails(clerkUser.id);
        if (response.success) {
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded) {
      fetchUserDetails();
    }
  }, [clerkUser, isLoaded]);

  if (!isLoaded || isLoading) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userDetails) return;

    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleLanguageChange = (value: string) => {
    if (!userDetails) return;

    setUserDetails({
      ...userDetails,
      preferredLanguage: value,
    });
  };

  const handleDeleteAddress = async (addressId: string) => {
    console.log(addressId)
    try {
      const response = await DeleteAddress(addressId);
      
      if (response.success) {
        // Update local state to remove the deleted address
        setUserDetails(prev => prev ? {
          ...prev,
          addresses: prev.addresses.filter(addr => addr.id !== addressId)
        } : null);

        toast({
          title: "Address Deleted",
          description: "The address has been successfully removed.",
          variant: "default",
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // TODO: Implement update user details action
    console.log("Updated user data:", userDetails);
  };

  if (!userDetails) {
    return <div>No user details found</div>;
  }

  // Get the default address if it exists
  const defaultAddress = userDetails.addresses?.find((addr) => addr.isDefault);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={clerkUser.imageUrl}
                  alt={clerkUser.fullName || ""}
                />
                <AvatarFallback>
                  {clerkUser.firstName?.[0]}
                  {clerkUser.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{clerkUser.fullName}</CardTitle>
                <CardDescription>
                  {clerkUser.primaryEmailAddress?.emailAddress}
                </CardDescription>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="mr-2">
                    Member since{" "}
                    {new Date(userDetails.createdAt).toLocaleDateString()}
                  </Badge>
                  <Badge variant="secondary">
                    {userDetails.orders?.length || 0} orders
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="payments">
                <CreditCard className="w-4 h-4 mr-2" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={clerkUser.fullName || ""}
                      disabled={true} // Name should be managed through Clerk
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={clerkUser.primaryEmailAddress?.emailAddress || ""}
                      disabled={true} // Email should be managed through Clerk
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={userDetails.phone || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                
                  <div className="flex justify-between gap-5">
                    <div>
                    <Label>Default Shipping Address</Label>
                    </div>

                    <div>
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
                address={userDetails.addresses}
              
              />
            </DialogContent>
          </Dialog>
        
                    </div>

                  </div>
                  {userDetails.addresses?.map((address) => (
                    <Card
                      key={address.id}
                      className="hover:shadow-md transition-shadow duration-200"
                    >
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
                              <p className="font-medium text-lg">
                                {address.street}
                              </p>
                              <p className="text-muted-foreground">
                                {address.city}, {address.state}{" "}
                                {address.postalCode}
                              </p>
                              <p className="text-muted-foreground">
                                {address.country}
                              </p>
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
                              onClick={() => handleDeleteAddress(address.id)}
                              className="hover:bg-destructive hover:text-destructive-foreground"
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
              </form>
            </TabsContent>
            <TabsContent value="orders">
              <div className="space-y-4">
                {userDetails.orders?.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Order #{order.id}</h3>
                      <Badge>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-medium mt-2">Total: ${order.price}</p>
                    <div className="mt-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="text-sm text-muted-foreground"
                        >
                          {item.quantity}x {item.product.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="payments">
              <p className="text-muted-foreground">
                Your payment methods and history will be shown here.
              </p>
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredLanguage">Preferred Language</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <Select
                      disabled={!isEditing}
                      value={userDetails.preferredLanguage || "English"}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger id="preferredLanguage">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-between mt-4">
          {isEditing && (
            <>
              <Button type="submit" onClick={handleSubmit}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
