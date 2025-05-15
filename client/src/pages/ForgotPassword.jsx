import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/features/api/otpApi";
import { useResetPasswordMutation } from "@/features/api/authApi";
import { toast } from "sonner";

const ForgotPassword = ({setShowForgotPassword}) => {
  const [sendOtp, { isLoading: sendingOtp, isSuccess: otpSendSuccess }] =
    useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp, isSuccess: otpVerifySuccess }] =
    useVerifyOtpMutation();
  const [
    resetPassword,
    {
      isLoading: resetPassLoading,
      isError: resetPasswordError,
      isSuccess: resetPasswordSuccess,
    },
  ] = useResetPasswordMutation();
  const [resetPassInput, setResetPassInput] = useState({
    email: "",
    otp: "",
    password: "",
  });
  const [showOtpField, setShowotpField] = useState(false);
  const [showPassField, setShowPassField] = useState(false);

  const changeInputHandler = (e) => {
    const { name, value } = e.target;
    setResetPassInput({ ...resetPassInput, [name]: value });
  };

  const handleSendOtp = async () => {
    if (!resetPassInput.email) return toast.error("Email is required.");
    try {
      const res = await sendOtp({ email: resetPassInput.email }).unwrap();
      toast.success(res.message || "OTP sent to email.");
      setShowotpField(true);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!resetPassInput.otp) return toast.error("Enter OTP first");
    try {
      const res = await verifyOtp({
        email: resetPassInput.email,
        otp: resetPassInput.otp,
      }).unwrap();
      toast.success(res.message || "OTP verified.");
      setShowotpField(false);
      setShowPassField(true);
    } catch (error) {
      toast.error(error?.data?.message || "OTP verification failed.");
    }
  };
  const handleResetPassword = async () => {
    try {
      const res = await resetPassword({
        email: resetPassInput.email,
        password: resetPassInput.password,
      });
      toast.success(res.message || "Password reset successfully!");
      setResetPassInput({
        email: "",
        otp: "",
        password: "",
      });
      setShowPassField(false);
      setShowForgotPassword(false)
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reset password.");
    }
  };
  const handleSendOtpForReset = async () => {
    if (!showOtpField) {
      await handleSendOtp();
    } else if (showOtpField && !showPassField) {
      await handleVerifyOtp();
    }
  };
  return (
    <div className="w-[400px]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your registered email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={resetPassInput.email}
              onChange={(e) => changeInputHandler(e)}
              placeholder="Eg. john@gmail.com"
              required
            />
          </div>
          {showOtpField && (
            <div className="space-y-1">
              <Label>Enter OTP</Label>
              <Input
                type="text"
                name="otp"
                value={resetPassInput.otp}
                onChange={(e) => changeInputHandler(e)}
                placeholder="Eg. 1111"
                required
              />
            </div>
          )}
          {showPassField && (
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={resetPassInput.password}
                onChange={(e) => changeInputHandler(e)}
                placeholder="Eg. xyz"
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex  gap-9 mt-2">
            {showPassField ? (
              <Button onClick={handleResetPassword}>
                {resetPassLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reseting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            ) : (
              <Button
                disabled={
                  resetPassInput.email.length === 0 ||
                  (showOtpField && resetPassInput.otp.length !== 4)
                }
                onClick={handleSendOtpForReset}
              >
                {sendingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : showOtpField ? (
                  verifyingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Submit OTP"
                  )
                ) : (
                  "Send OTP"
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
