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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { DeleteAddress, getUserDetails } from "@/lib/queries";
import { redirect } from "next/navigation";
import { type UserWithDetails } from "@/lib/types";
import LoadingPage from "../loading-page";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddressModal } from "./AddressModal";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AccountPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState<UserWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchUserDetails() {
      if (!clerkUser) return;

      try {
        const response = await getUserDetails(clerkUser.id);
        if (response.success) {
          setUserDetails(response.data);
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user details. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded) {
      fetchUserDetails();
    }
  }, [clerkUser, isLoaded, toast]);

  // Validate phone number
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userDetails) return;

    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleLanguageChange = (value: string) => {
    if (!userDetails) return;

    setUserDetails({
      ...userDetails,
      preferredLanguage: value,
    });
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await DeleteAddress(addressId);
      
      if (response.success) {
        setUserDetails(prev => prev ? {
          ...prev,
          addresses: prev.addresses.filter(addr => addr.id !== addressId)
        } : null);

        toast({
          title: "Success",
          description: "Address deleted successfully",
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (userDetails?.phone && !validatePhone(userDetails.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Implement update user details action
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || isLoading) {
    return <LoadingPage />;
  }

  if (!clerkUser) {
    redirect("/sign-in");
  }

  if (!userDetails) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load user details. Please refresh the page or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  const getOrderStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-green-100 text-green-800',
      'delivered': 'bg-green-500 text-white',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20 ring-2 ring-primary/10">
                <AvatarImage
                  src={clerkUser.imageUrl}
                  alt={clerkUser.fullName || ""}
                />
                <AvatarFallback className="bg-primary/5">
                  {clerkUser.firstName?.[0]}
                  {clerkUser.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {clerkUser.fullName}
                </CardTitle>
                <CardDescription className="text-base">
                  {clerkUser.primaryEmailAddress?.emailAddress}
                </CardDescription>
                <div className="flex items-center mt-2 gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Member since {new Date(userDetails.createdAt).toLocaleDateString()}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {userDetails.orders?.length || 0} orders
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className="transition-all"
            >
              {isEditing ? (
                <>Cancel Editing</>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary/10">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-primary/10">
                <Package className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-primary/10">
                <CreditCard className="w-4 h-4 mr-2" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary/10">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="profile">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={clerkUser.fullName || ""}
                        disabled={true}
                        className="bg-muted/50"
                      />
                      <p className="text-xs text-muted-foreground">
                        Managed by Clerk authentication
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={clerkUser.primaryEmailAddress?.emailAddress || ""}
                        disabled={true}
                        className="bg-muted/50"
                      />
                      <p className="text-xs text-muted-foreground">
                        Managed by Clerk authentication
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={userDetails.phone || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg">Shipping Addresses</Label>
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Address
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

                    <div className="grid gap-4">
                      {userDetails.addresses?.map((address) => (
                        <Card
                          key={address.id}
                          className={`transition-all hover:shadow-md ${
                            address.isDefault ? 'ring-2 ring-primary/10' : ''
                          }`}
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
                                    {address.city}, {address.state} {address.postalCode}
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
                                  className="hover:bg-primary/10"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span className="sr-only">Edit address</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="hover:bg-red-100 hover:text-red-600"
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
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="orders">
                <div className="space-y-4">
                  {userDetails.orders?.length ? (
                    userDetails.orders.map((order) => (
                      <Card key={order.id} className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium">Order # {order.paymentIntentId} </h3>
                                <Badge className={getOrderStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                       
                            <p className="font-medium text-lg">
                              ${order.amount}
                            </p>
                          </div>

                          
                          
                          <Separator className="my-4" />
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Order Items</h4>
                            <div className="grid gap-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                                >
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="w-8 h-8 flex items-center justify-center p-0">
                                      {item.quantity}
                                    </Badge>
                                    <span className="font-medium">{item.product.name}</span>
                                  </div>
                                  <span className="text-muted-foreground">
                                    ${(item.quantity * item.product.price).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-muted/50">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <Package className="w-12 h-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground text-center">
                          No orders yet. Start shopping to see your order history here!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="payments">
                <Card className="bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <CreditCard className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-center">
                      Payment methods and history will be available soon.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    <div className="flex items-center space-x-2 max-w-xs">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <Select
                        disabled={!isEditing}
                        value={userDetails.preferredLanguage || "English"}
                        onValueChange={handleLanguageChange}
                      >
                        <SelectTrigger id="preferredLanguage" className="w-full">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish (Español)</SelectItem>
                          <SelectItem value="French">French (Français)</SelectItem>
                          <SelectItem value="German">German (Deutsch)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            Manage your email preferences
                          </p>
                        </div>
                        <Button variant="outline" disabled={!isEditing}>
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>

        <Separator />
        
        <CardFooter className="flex justify-end gap-2 p-4">
          {isEditing && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving}
                className="min-w-[100px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}