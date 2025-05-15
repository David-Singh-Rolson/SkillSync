// pages/HomePage.jsx
import React, { useEffect } from "react";
import HeroSection from "../pages/student/HeroSection";
import RecommendedCourses from "../pages/student/RecommendedCourses";
import Assessments from "../pages/student/Assessments";
import Courses from "../pages/student/Courses";
import { useLoadUserQuery } from "../features/api/authApi";
import { Loader2 } from "lucide-react";
import { useGetUserRecommendationsQuery } from "@/features/api/recommendationApi";
import { useSelector, useDispatch } from "react-redux";
import { setShowLoginModal } from "@/features/uiSlice";
import Login from "@/pages/Login";
import Footer from "@/components/Footer";
const HomePage = () => {
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useLoadUserQuery();
  const {
    data: recommendationdata,
    isSuccess,
    isError,
  } = useGetUserRecommendationsQuery();
  const { showLoginModal } = useSelector((state) => state.ui);
  const modalType = useSelector((state) => state.ui.modalType);

  useEffect(() => {
    refetch();

    if (isLoading) {
      return <Loader2 />;
    }
  }, [data]);

  return (
    <>
      <HeroSection />
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg relative w-[450px]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => dispatch(setShowLoginModal(false))}
            >
              ✕
            </button>
            <Login modalType={modalType} />
          </div>
        </div>
      )}
      {data?.user && (
        <>
          {data.user.role === "student" && (
            <RecommendedCourses recommendationdata={recommendationdata} />
          )}
          <Assessments role={data.user.role} />
        </>
      )}
          <Courses />
<Footer/>
    </>
  );
};

export default HomePage;
