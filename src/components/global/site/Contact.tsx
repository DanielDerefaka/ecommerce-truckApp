"use client"
import React from 'react';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Note: I should mention that while I've included the imports for completeness,
// some of these (like zod, react-hook-form) aren't actually available in the current environment.
// You would need to install them in your project.

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  zip: z.string().min(5, 'ZIP code must be at least 5 digits'),
  interests: z.object({
    sleeperTractors: z.boolean().optional(),
    nonSleeperTractors: z.boolean().optional(),
    straightTrucks: z.boolean().optional(),
    trailers: z.boolean().optional(),
    warranties: z.boolean().optional(),
    financing: z.boolean().optional(),
    other: z.boolean().optional(),
  }),
  message: z.string().optional(),
  marketingConsent: z.boolean(),
});

const TruckSalesContact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: {},
      marketingConsent: false,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Used Semi-Trucks for Sale
            </CardTitle>
            <p className="mt-4 text-gray-600">
              We welcome our customer's questions and comments, whether you are inquiring about used semi-trucks for sale, 
              would like more information on a specific trailer, or simply wish to contact a specific branch. 
              If you would prefer to discuss your inquiry over the phone, you may call{' '}
              <a href="tel:800-311-7144" className="text-blue-600 hover:underline">
                800-311-7144
              </a>
              .
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="zip">ZIP *</Label>
                <Input
                  id="zip"
                  {...register('zip')}
                  className={errors.zip ? 'border-red-500' : ''}
                />
                {errors.zip && (
                  <p className="mt-1 text-sm text-red-500">{errors.zip.message}</p>
                )}
              </div>

              <div>
                <Label>I would like information on *</Label>
                <div className="mt-4 space-y-3">
                  {[
                    ['sleeperTractors', 'Sleeper Tractors'],
                    ['nonSleeperTractors', 'Non-Sleeper Tractors'],
                    ['straightTrucks', 'Straight Trucks (Box, Dump, etc.)'],
                    ['trailers', 'Trailers'],
                    ['warranties', 'Warranties and Protection Plans'],
                    ['financing', 'Financing'],
                    ['other', 'Other (Give Details Below)'],
                  ].map(([key, label]) => (
                    <div key={key} className="flex items-center">
                      <Checkbox
                        id={key}
                        {...register(`interests.${key}`)}
                      />
                      <Label htmlFor={key} className="ml-2">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  {...register('message')}
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Checkbox
                    id="marketingConsent"
                    {...register('marketingConsent')}
                  />
                </div>
                <Label htmlFor="marketingConsent" className="ml-2 text-sm text-gray-600">
                  By submitting this form, you consent to receive marketing emails and/or texts 
                  from Arrow Truck Sales. You can unsubscribe at any time by clicking the 
                  unsubscribe link at the bottom of our emails or replying STOP to our text 
                  messages. By clicking the button below, you indicate that you've read our{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  {' '}and agree to our Terms of Use.
                </Label>
              </div>

              <div>
                <Button 
                  type="submit"
                  className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white"
                >
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TruckSalesContact;