import React, { useState, Dispatch, SetStateAction } from "react";
import {
     Card,
     CardHeader,
     CardTitle,
     CardDescription,
     CardContent,
     CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, AlertCircle } from "lucide-react";

interface AppProps {
     setAuth: Dispatch<SetStateAction<boolean>>;
}

// Define types explicitly for the event handlers
const Register: React.FC<AppProps> = ({ setAuth }) => {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [confirmPassword, setConfirmPassword] = useState("");
     const [error, setError] = useState("");
     const [isLoading, setIsLoading] = useState(false);

     const handleLoginClick = () => {
          console.log("Navigate to login");
     };

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
          if (name === "email") setEmail(value);
          if (name === "password") setPassword(value);
          if (name === "confirmPassword") setConfirmPassword(value);
     };

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setIsLoading(true);

          try {
               if (!email || !password || !confirmPassword) {
                    throw new Error("Please fill in all fields.");
               }
               if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    throw new Error("Please enter a valid email address.");
               }
               if (password !== confirmPassword) {
                    throw new Error("Passwords do not match.");
               }

               const response = await fetch("/register", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
               });

               if (!response.ok) {
                    throw new Error("Error registering account.");
               }

               // After successful registration, set the user as authenticated
               
               setError("Registration successful!");
               setAuth(true);

          } catch (err: unknown) {
               if (err instanceof Error) {
                    setError(err.message);
               } else {
                    setError("An unknown error occurred.");
               }
          } finally {
               setIsLoading(false);
          }
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
               <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                         <CardTitle className="text-2xl font-bold text-center">
                              Create an account
                         </CardTitle>
                         <CardDescription className="text-center text-gray-500">
                              Enter your details below to create your account
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="space-y-2">
                                   <Label htmlFor="email">Email</Label>
                                   <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                             id="email"
                                             name="email"
                                             type="email"
                                             placeholder="name@example.com"
                                             value={email}
                                             onChange={handleChange}
                                             className="pl-10"
                                             required
                                        />
                                   </div>
                              </div>

                              <div className="space-y-2">
                                   <Label htmlFor="password">Password</Label>
                                   <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                             id="password"
                                             name="password"
                                             type="password"
                                             placeholder="Enter your password"
                                             value={password}
                                             onChange={handleChange}
                                             className="pl-10"
                                             required
                                        />
                                   </div>
                              </div>

                              <div className="space-y-2">
                                   <Label htmlFor="confirmPassword">Confirm Password</Label>
                                   <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                             id="confirmPassword"
                                             name="confirmPassword"
                                             type="password"
                                             placeholder="Confirm your password"
                                             value={confirmPassword}
                                             onChange={handleChange}
                                             className="pl-10"
                                             required
                                        />
                                   </div>
                              </div>

                              {error && (
                                   <Alert variant={error.includes("successful") ? "default" : "destructive"}>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                   </Alert>
                              )}

                              <Button type="submit" className="w-full" disabled={isLoading}>
                                   {isLoading ? "Creating account..." : "Create account"}
                              </Button>
                         </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                         <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                   <span className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                   <span className="bg-white px-2 text-gray-500">or</span>
                              </div>
                         </div>
                         <Button variant="outline" className="w-full" onClick={handleLoginClick}>
                              Sign in to existing account
                         </Button>
                    </CardFooter>
               </Card>
          </div>
     );
}

export default Register;
