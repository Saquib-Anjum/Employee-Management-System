import { Building2Icon, Calendar1Icon, FileTextIcon, UserIcon } from 'lucide-react'
import React from 'react'

function AdminDashboard({dashboardData}) {
const stats =[

   {
  icon:UserIcon,
  value:dashboardData.totalEmployees,
  label:"Total Employees",
  description:"Active workforce"
},
 {
  icon:Building2Icon,
  value:dashboardData.totalDepartments,
  label:"Departments",
  description:"Organization Units"
},
 {
  icon:Calendar1Icon,
  value:dashboardData.todayAttendance,
  label:"Total Attendance",
  description:"Checked in today"
},
 {
  icon:FileTextIcon,
  value:dashboardData.pendingLeaves,
  label:"Pending Leaves",
  description:"Awaiting approval"
}
]

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p>
         Welcome back, Admin - here's you overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 w-full">
        {stats.map((ele, idx) => {
          return (
            <div
              key={idx}
              className="card-hover card p-5 sm:p-6 relative overflow-hidded group flex items-center justify-between "
            >
              <div className="">
                {/* slef colsing */}
                <div className=" absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70 transition-colors"></div>
                <p className="text-sm text-slate-700 font-medium">
                  {ele.label}
                </p>
                <p className="text-2xl font-bold text-slate-700">{ele.value}</p>
              </div>
              <ele.icon className="size-10 p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors" />
            </div>
          );
        })}
      </div>
      {/* <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/attendance"
          className="btn-primary text-center inline-flex items-center justify-center gap-2"
        >
          Mark Attendance <ArrowRightIcon className="w-4 h-4" />
        </Link>

        <Link
          to="/leave"
          className="btn-secondary text-center"
        >
          Apply for Leave      </Link>
      </div> */}
    </div>
  )
}

export default AdminDashboard
