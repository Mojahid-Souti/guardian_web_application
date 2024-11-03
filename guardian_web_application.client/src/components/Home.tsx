import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import "@fontsource/audiowide";
import ParticlesContainer from "@/components/ParticlesBackground";
import AuthorizeView from './base/AuthorizeView';

interface PageProps {
     title: string;
}

const Home: React.FC<PageProps> = ({ title }) => {
     return (
          <AuthorizeView>
               <div className="relative flex flex-col items-center justify-center w-full min-h-screen p-5 bg-gray-100 lg:p-5">
                    {/* Main Home Section */}
                    <div className="relative z-10 w-full h-full p-3 overflow-hidden duration-300 bg-white rounded-lg shadow-md">
                         {/* Particles Background contained within the white div */}
                         <div className="absolute inset-0">
                              <ParticlesContainer />
                         </div>

                         {/* Content Container with relative positioning */}
                         <div className="relative z-10">
                              <div className="relative flex items-center justify-between w-full pt-3 pb-3">
                                   {/* Title */}
                                   <h1 className="text-2xl font-normal text-left text-gray-800 font-poppins">{title}</h1>

                                   {/* Removed Clerk Signed In/Out Logic */}
                              </div>

                              <div className="relative left-0 right-0 top-18">
                                   <div className="w-full border-b border-gray-300 opacity-30"></div>
                              </div>

                              {/* Centered Content */}
                              <div className="relative z-10 flex flex-col items-center justify-center p-36">
                                   <div className="space-y-6 text-center">
                                        <h1 className="mb-4 text-6xl font-medium text-black origin-left font-audiowide">
                                             Welcome to
                                             <span className="font-bold text-transparent bg-gradient-to-br from-orange-400 to-pink-500 bg-clip-text"> G</span>UARDIAN
                                        </h1>
                                        <p className="max-w-2xl mx-auto mb-12 text-xl text-zinc-600">
                                             Your Intelligent Defense System for Network Security
                                        </p>
                                        <Button
                                             className="gap-2 px-8 py-6 text-lg transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 hover:shadow-xl"
                                        >
                                             Get Started
                                             <ArrowRight className="w-5 h-5" />
                                        </Button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </AuthorizeView>
     );
}

export default Home;
