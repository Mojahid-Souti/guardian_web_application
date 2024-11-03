import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Loader2 } from "lucide-react";

interface AppProps {
     setAuth: Dispatch<SetStateAction<boolean>>;
}

// Define types explicitly for the event handlers
const Login: React.FC<AppProps> = ({ setAuth }) => {
     const [email, setEmail] = useState<string>("");
     const [password, setPassword] = useState<string>("");
     const [rememberme, setRememberme] = useState<boolean>(false);
     const [error, setError] = useState<string>("");
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const navigate = useNavigate();

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
          if (name === "email") setEmail(value);
          if (name === "password") setPassword(value);
          if (name === "rememberme") setRememberme(e.target.checked);
     };

     const handleRegisterClick = () => {
          navigate("/register");
     };

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (!email || !password) {
               setError("Please fill in all fields.");
               return;
          }

          setIsLoading(true);
          setError("");

          const loginurl = rememberme ? "/login?useCookies=true" : "/login?useSessionCookies=true";

          try {
               const response = await fetch(loginurl, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
               });

               if (response.ok) {
                    setAuth(true);
                    setError("Successful Login.");
                    window.location.href = '/';
               } else {
                    setError("Invalid email or password.");
               }
          } catch (error) {
               console.error(error);
               setError("Network error. Please try again.");
          } finally {
               setIsLoading(false);
          }
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
               <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                         <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                         <CardDescription className="text-center text-gray-500">
                              Enter your email to sign in to your account
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="space-y-2">
                                   <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                             type="email"
                                             id="email"
                                             name="email"
                                             placeholder="Email address"
                                             value={email}
                                             onChange={handleChange}
                                             className="pl-10"
                                             required
                                        />
                                   </div>
                              </div>
                              <div className="space-y-2">
                                   <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                             type="password"
                                             id="password"
                                             name="password"
                                             placeholder="Password"
                                             value={password}
                                             onChange={handleChange}
                                             className="pl-10"
                                             required
                                        />
                                   </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                   <Checkbox
                                        id="rememberme"
                                        name="rememberme"
                                        checked={rememberme}
                                        onCheckedChange={(checked) => setRememberme(Boolean(checked))}
                                   />
                                   <label
                                        htmlFor="rememberme"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                   >
                                        Remember me
                                   </label>
                              </div>
                              {error && (
                                   <Alert variant="destructive" className="mt-4">
                                        <AlertDescription>{error}</AlertDescription>
                                   </Alert>
                              )}
                              <Button
                                   type="submit"
                                   className="w-full"
                                   disabled={isLoading}
                              >
                                   {isLoading ? (
                                        <>
                                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                             Signing in...
                                        </>
                                   ) : (
                                        "Sign in"
                                   )}
                              </Button>
                         </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                         <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                   <span className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                   <span className="bg-white px-2 text-gray-500">Or</span>
                              </div>
                         </div>
                         <Button
                              variant="outline"
                              className="w-full"
                              onClick={handleRegisterClick}
                         >
                              Create an account
                         </Button>
                    </CardFooter>
               </Card>
          </div>
     );
}

export default Login;
