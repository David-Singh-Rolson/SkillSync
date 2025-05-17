import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { useGetAllPublishedAssessmentsQuery } from '@/features/api/assessmentApi'
import AssessmentCard from './AssessmentCard'

const Assessments = ({ role }) => {
  const { data, isLoading, isSuccess, isError } = useGetAllPublishedAssessmentsQuery()
  
  return (
    <div className="bg-gray-50 dark:bg-[#141414]">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Assessments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
  Array.from({ length: 4 }).map((_, index) => (
    <AssessmentSkeleton key={index} />
  ))
) : isError ? (
  <div className="col-span-full text-center text-gray-500 dark:text-gray-300 text-lg font-medium">
    <pre>

    No Assessments Found! 
     Explore our courses
    </pre>
  </div>
) : (
  data?.assessments?.map((assessment) => (
    <AssessmentCard key={assessment._id} assessment={assessment} role={role} />
  ))
)}

        </div>
      </div>
    </div>
  )
}

export default Assessments

const AssessmentSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
