import { Menu, School } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setShowLoginModal ,setModalType} from "@/features/uiSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Add state to control dropdown open/close
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoutHandler = async () => {
    setDropdownOpen(false); // Close dropdown when logging out
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/");
    }
  }, [isSuccess]);

  // Navigate and close dropdown helper
  const navigateAndClose = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl">
              SkillSync
            </h1>
          </Link>
        </div>
        {/* User icons and dark mode icon  */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {user?.role === "student" && (
                    <DropdownMenuItem
                      onSelect={() => navigateAndClose("/my-learning")}
                    >
                      My learning
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onSelect={() => navigateAndClose("/profile")}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => navigateAndClose("/admin/dashboard")}
                    >
                      Dashboard
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {dispatch(setModalType("login"));dispatch(setShowLoginModal(true))}}
              >
                Login
              </Button>
              <Button onClick={() =>{dispatch(setModalType("signup")); dispatch(setShowLoginModal(true))}}>
                Signup
              </Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/* Mobile device  */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">SkillSync</h1>
        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  // Helper to navigate and close sheet
  const navigateAndClose = (path) => {
    setOpen(false);
    navigate(path);
  };

  const logoutHandler = async () => {
    setOpen(false);
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/");
    }
  }, [isSuccess]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>
            <span
              className="cursor-pointer"
              onClick={() => navigateAndClose("/")}
            >
              SkillSync
            </span>
          </SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4 mt-4">
          <span
            className="cursor-pointer"
            onClick={() => navigateAndClose("/my-learning")}
          >
            My Learning
          </span>
          <span
            className="cursor-pointer"
            onClick={() => navigateAndClose("/profile")}
          >
            Edit Profile
          </span>
          <span className="cursor-pointer" onClick={logoutHandler}>
            Log out
          </span>
        </nav>
        {user?.role === "instructor" && (
          <SheetFooter className="mt-auto pb-4">
            <Button
              type="submit"
              onClick={() => navigateAndClose("/admin/dashboard")}
            >
              Dashboard
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
