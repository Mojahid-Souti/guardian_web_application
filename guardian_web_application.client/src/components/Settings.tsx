

interface PageProps {
     title: string;
}


const Settings: React.FC<PageProps> = ({ title }) => {
     return (
          <div className="relative flex w-full h-screen p-5 bg-gray-100 shadow-md lg:p-5 rounded-xl">

               {/* Main content */}
               <div className="flex flex-col w-full h-full bg-white rounded-md shadow-md">
                    <div className="p-4 border-b border-gray-200">
                         <h1 className="text-2xl font-normal text-gray-800 font-poppins">
                              {title}
                         </h1>
                    </div>
               </div>
          </div>
     );
};

export default Settings;
