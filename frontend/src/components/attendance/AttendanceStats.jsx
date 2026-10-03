import { AlertCircleIcon, Calendar1Icon, Clock10Icon } from 'lucide-react';
import React from 'react'

function AttendanceStats({history}) {
  //console.log("History attendance stats" ,history)
  const totalPresent = history.filter((ele)=>ele.status==='PRESENT' || ele.status==="LATE").length;
  const totalLate = history.filter((ele)=>ele.status==="LATE").length;
  const stats =[
   {
    label:"Days Present",
    value:totalPresent,
    icon:Calendar1Icon,    
   },
   {
    label:"Late Arrivals",
    value:totalLate,
    icon:AlertCircleIcon,    
   },
   {
    label:"Avg. Work Hrs",
    value:"8.5Hrs",
    icon:Clock10Icon,    
   },
  ]
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 sm:gap-5 mb-8'>
      {
       
     stats.map((ele,idx)=>(
<div key={idx} className='card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group'>
  <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70'></div>

  <div className='p-3 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200'>
    <ele.icon className='w-5 h-5 text-slate-600 group-hover:text-indigo-600 transiton-colors duration-200'/>
  </div>
  <div className=''>
    <p className='text-sm text-slate-500'>{ele.label}</p>
    <p className='text-2xl font-medium text-slate-900 tracking-tight'>
      {
        ele.value
      }
    </p>
  </div>
</div>

     ))
      }
    </div>
  )
}

export default AttendanceStats
