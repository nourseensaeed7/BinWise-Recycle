import React from 'react'

const StatCard = ({title,value}) => {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
  </div>
  )
}

export default StatCard
