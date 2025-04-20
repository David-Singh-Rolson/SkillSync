// import { ChartNoAxesColumn, PenLineIcon, SquareLibrary } from "lucide-react";
// import React from "react";
// import { Link, Outlet, useLocation } from "react-router-dom";

// const Sidebar = () => {
//   const location = useLocation();

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div className="hidden lg:block w-[300px] sm:w-[200px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 sticky top-0 h-full bg-white dark:bg-gray-800">
//         <div className="space-y-4">
//           <div className="space-y-2">
//             {/* Dashboard Tab */}
//             <Link to="dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-md ${isActive('/dashboard') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'} transition-all`}>
//               <ChartNoAxesColumn size={22} />
//               <h1 className="font-medium">Dashboard</h1>
//             </Link>
//             {/* Courses Tab */}
//             <Link to="course" className={`flex items-center gap-2 px-3 py-2 rounded-md ${isActive('/course') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'} transition-all`}>
//               <SquareLibrary size={22} />
//               <h1 className="font-medium">Courses</h1>
//             </Link>
//             {/* Create Test Tab */}
//             <Link to="assessment" className={`flex items-center gap-2 px-3 py-2 rounded-md ${isActive('/assessment') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'} transition-all`}>
//               <PenLineIcon size={22} />
//               <h1 className="font-medium">Create Test</h1>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 p-10 bg-gray-50 dark:bg-gray-900">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import { ChartNoAxesColumn, PenLineIcon, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:block fixed top-16 left-0 h-screen w-[300px] sm:w-[200px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 bg-white dark:bg-gray-800 z-50">
        <div className="space-y-4">
          <div className="space-y-2">
            {/* Dashboard Tab */}
            <Link
              to="dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                isActive("/dashboard")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
              } transition-all`}
            >
              <ChartNoAxesColumn size={22} />
              <h1 className="font-medium">Dashboard</h1>
            </Link>
            {/* Courses Tab */}
            <Link
              to="course"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                isActive("/course")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
              } transition-all`}
            >
              <SquareLibrary size={22} />
              <h1 className="font-medium">Courses</h1>
            </Link>
            {/* Create Test Tab */}
            <Link
              to="assessment"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                isActive("/assessment")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
              } transition-all`}
            >
              <PenLineIcon size={22} />
              <h1 className="font-medium">Create Test</h1>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto ml-[300px] sm:ml-[200px] p-10 bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;

