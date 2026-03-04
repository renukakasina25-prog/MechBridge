import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '@/entities/User';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, User as UserIcon, Mail, Phone, Home, Save, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        reset(currentUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("You must be logged in to view this page.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      await User.updateMyUserData(data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-bajaj-blue" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 md:p-6 text-center">
        <h1 className="text-xl text-red-600">Access Denied</h1>
        <p>Please log in to manage your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gradient mb-2">My Profile</h1>
              <p className="text-slate-600">View and manage your personal details and address.</p>
            </div>
        </div>

        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <UserIcon className="w-6 h-6 text-bajaj-blue" />
              <span>Personal Information</span>
            </CardTitle>
            <CardDescription>Keep your personal details up to date.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700">Full Name</label>
                  <div className="relative">
                     <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input value={user.full_name} disabled className="pl-10 bg-slate-100" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700">Email Address</label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input value={user.email} disabled className="pl-10 bg-slate-100" />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phone_number" className="font-semibold text-slate-700">Phone Number</label>
                  <div className="relative">
                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input id="phone_number" {...register("phone_number")} placeholder="e.g., 9876543210" className="pl-10" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                 <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-bajaj-blue" />
                    Shipping Address
                </h3>
                <div className="space-y-4">
                    {/* Address Line 1 */}
                    <div className="space-y-2">
                        <label htmlFor="address_line1" className="font-semibold text-slate-700">Address Line 1</label>
                        <Input id="address_line1" {...register("address_line1")} placeholder="House No., Building Name, Street" />
                    </div>

                     {/* Address Line 2 */}
                    <div className="space-y-2">
                        <label htmlFor="address_line2" className="font-semibold text-slate-700">Address Line 2 (Optional)</label>
                        <Input id="address_line2" {...register("address_line2")} placeholder="Area, Landmark" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                         {/* City */}
                        <div className="space-y-2">
                            <label htmlFor="city" className="font-semibold text-slate-700">City</label>
                            <Input id="city" {...register("city")} placeholder="e.g., Mumbai" />
                        </div>
                        {/* State */}
                        <div className="space-y-2">
                            <label htmlFor="state" className="font-semibold text-slate-700">State</label>
                            <Input id="state" {...register("state")} placeholder="e.g., Maharashtra" />
                        </div>
                        {/* Pincode */}
                        <div className="space-y-2">
                            <label htmlFor="pincode" className="font-semibold text-slate-700">Pincode</label>
                            <Input id="pincode" {...register("pincode")} placeholder="e.g., 400001" />
                        </div>
                    </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-bajaj-blue to-classy-black text-white px-8">
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}