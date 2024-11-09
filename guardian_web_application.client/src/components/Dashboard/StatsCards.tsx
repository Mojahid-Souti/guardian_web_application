/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaNetworkWired, FaShieldAlt, FaUserShield, FaTrafficLight } from "react-icons/fa";

interface StatsCardsProps {
     stats: Record<string, any>;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
     return (
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
               <Card className="relative p-0 overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20" />
                    <div className="absolute inset-[1px] bg-gray-100 rounded-lg" />
                    <div className="relative p-4">
                         <CardHeader className="p-0 pb-2">
                              <CardTitle className="flex items-center text-lg text-gray-800">
                                   <FaNetworkWired className="mr-2 text-2xl text-blue-500" />
                                   Packets
                              </CardTitle>
                         </CardHeader>
                         <CardContent className="p-0">
                              <CardDescription className="text-2xl font-bold text-gray-900">
                                   {stats.TotalPackets?.toLocaleString() ?? '0'}
                              </CardDescription>
                              <CardDescription className="flex items-center text-base">
                                   <span className="text-green-500">+10%</span>
                                   <span className="ml-1 text-gray-500">From last week</span>
                              </CardDescription>
                              <Button size="sm" className="mt-3 text-sm text-white bg-black hover:bg-black/80">
                                   View Details
                              </Button>
                         </CardContent>
                    </div>
               </Card>

               <Card className="relative p-0 overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20" />
                    <div className="absolute inset-[1px] bg-gray-100 rounded-lg" />
                    <div className="relative p-4">
                         <CardHeader className="p-0 pb-2">
                              <CardTitle className="flex items-center text-lg text-gray-800">
                                   <FaShieldAlt className="mr-2 text-2xl text-red-500" />
                                   Attacks
                              </CardTitle>
                         </CardHeader>
                         <CardContent className="p-0">
                              <CardDescription className="text-2xl font-bold text-gray-900">
                                   {stats.Attacks ?? '0'}
                              </CardDescription>
                              <CardDescription className="flex items-center text-base">
                                   <span className="text-red-500">+3</span>
                                   <span className="ml-1 text-gray-500">Last hour</span>
                              </CardDescription>
                              <Button size="sm" className="mt-3 text-sm text-white bg-black hover:bg-black/80">
                                   Review Logs
                              </Button>
                         </CardContent>
                    </div>
               </Card>

               <Card className="relative p-0 overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20" />
                    <div className="absolute inset-[1px] bg-gray-100 rounded-lg" />
                    <div className="relative p-4">
                         <CardHeader className="p-0 pb-2">
                              <CardTitle className="flex items-center text-lg text-gray-800">
                                   <FaUserShield className="mr-2 text-2xl text-green-500" />
                                   Intrusions
                              </CardTitle>
                         </CardHeader>
                         <CardContent className="p-0">
                              <CardDescription className="text-2xl font-bold text-gray-900">
                                   {stats.Intrusions ?? '0'}
                              </CardDescription>
                              <CardDescription className="flex items-center text-base">
                                   <span className="text-green-500">+20%</span>
                                   <span className="ml-1 text-gray-500">This month</span>
                              </CardDescription>
                              <Button size="sm" className="mt-3 text-sm text-white bg-black hover:bg-black/80">
                                   Prevention Logs
                              </Button>
                         </CardContent>
                    </div>
               </Card>

               <Card className="relative p-0 overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20" />
                    <div className="absolute inset-[1px] bg-gray-100 rounded-lg" />
                    <div className="relative p-4">
                         <CardHeader className="p-0 pb-2">
                              <CardTitle className="flex items-center text-lg text-gray-800">
                                   <FaTrafficLight className="mr-2 text-2xl text-yellow-500" />
                                   Threats
                              </CardTitle>
                         </CardHeader>
                         <CardContent className="p-0">
                              <CardDescription className="text-2xl font-bold text-gray-900">
                                   Moderate
                              </CardDescription>
                              <CardDescription className="flex items-center text-base">
                                   <span className="text-red-500">-2</span>
                                   <span className="ml-1 text-gray-500">Alerts active</span>
                              </CardDescription>
                              <Button size="sm" className="mt-3 text-sm text-white bg-black hover:bg-black/80">
                                   Threat Details
                              </Button>
                         </CardContent>
                    </div>
               </Card>
          </div>
     );
};

export default StatsCards;