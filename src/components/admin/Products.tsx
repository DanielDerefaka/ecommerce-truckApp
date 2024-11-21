"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import FileUpload from "../file-upload";
import { createProduct } from "@/lib/prismaQuery";
// import { Products } from "@/lib/quer   ies";



// Define the form schema with proper types
const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().min(0, "Stock cannot be negative"),
  images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),
  categoryId: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Category is required"),
  miles: z.string().min(1, "Category is required"),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

const AddProductPage = () => {
  const { toast } = useToast();

  // Initialize the form with proper types
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      images: [],
      categoryId: "",
      miles: "",
      location: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!values) {
        throw new Error("Form values are missing");
      }
      
      const response = await createProduct(values);
      
      if (!response) {
        throw new Error("Failed to create product");
      }
  
      toast({
        title: "Product Added Successfully",
        description: "Your product has been created"
      });
  
      form.reset();
      
    } catch (error) {
      console.error("Product creation error:", error);
  
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Could not add product. Please try again.";
  
      toast({
        variant: "destructive", 
        title: "Error",
        description: errorMessage
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Add New Product</h1>
              <p className="text-sm text-muted-foreground">Back to product list</p>
            </div>
          </div>
          <Button variant="outline">View Shop</Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium">Description</h2>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Full Spectrum CBD Tincture - Pet Tincture"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Product description..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 space-y-4">
                    <h2 className="text-lg font-medium">Category</h2>
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="health">Health & Medicine</SelectItem>
                              <SelectItem value="beauty">Beauty</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 space-y-4">
                    <h2 className="text-lg font-medium">Inventory</h2>
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 space-y-4">
                    <h2 className="text-lg font-medium">Country </h2>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel></FormLabel>
                          <FormControl>
                          <Input
                              placeholder="French Camp, CA"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                 
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">Product Images</h2>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>Upload product images here</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 space-y-4">
                    <h2 className="text-lg font-medium">Milles</h2>
                    <FormField
                      control={form.control}
                      name="miles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel></FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="121,222"
                              {...field}
                              
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">Pricing</h2>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>Set your product pricing</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <span className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                className="rounded-l-none"
                                placeholder="180.00"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Discard
              </Button>
              <Button 
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddProductPage;