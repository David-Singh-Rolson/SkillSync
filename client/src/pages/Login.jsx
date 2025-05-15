import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/features/api/otpApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ForgotPassword from "./ForgotPassword";

const Login = ({modalType}) => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
const [tab, setTab] = useState(modalType || "login");
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [resendTimer, setResendTimer] = useState(0); // in seconds
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();

  const [
    registerUser,
    { data: registerData, error: registerError, isLoading: registerIsLoading },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    { data: loginData, error: loginError, isLoading: loginIsLoading },
  ] = useLoginUserMutation();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };
  useEffect(() => {
    if (modalType) setTab(modalType); // update tab if modalType changes
  }, [modalType]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (!signupInput.email) return toast.error("Email is required.");
    try {
      const res = await sendOtp({ email: signupInput.email }).unwrap();
      toast.success(res.message || "OTP sent to email.");
      setOtpSent(true);
      setResendTimer(300);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtpAndRegister = async () => {
    if (!otp) return toast.error("Enter OTP first");
    try {
      const res = await verifyOtp({ email: signupInput.email, otp }).unwrap();
      toast.success(res.message || "OTP verified.");
      await registerUser(signupInput).unwrap();
      toast.success("Registration successful.");
      navigate("/"); // redirect after success
    } catch (error) {
      toast.error(error?.data?.message || "OTP verification failed.");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser(loginInput).unwrap();
      toast.success(res.message || "Login successful.");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || "Login failed.");
    }
  };

if (showForgotPassword) {
  return (
    <div className="flex items-center w-full justify-center mt-20">
      <div className="w-[400px]">

            <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
      </div>
    </div>
  );
}


  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs value={tab} onValueChange={setTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* SIGNUP TAB */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account. OTP will be sent to your email.
              </CardDescription>
            </CardHeader>

            {!otpSent ? (
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={signupInput.name}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Eg. John"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Role</Label>
                  <Select
                    name="role"
                    value={signupInput.role}
                    onValueChange={(value) =>
                      changeInputHandler(
                        { target: { name: "role", value } },
                        "signup"
                      )
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={signupInput.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Eg. john@gmail.com"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={signupInput.password}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Eg. xyz"
                    required
                  />
                </div>
              </CardContent>
            ) : (
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label>Enter OTP sent to email</Label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                  />
                </div>
              </CardContent>
            )}

            <CardFooter>
              {!otpSent ? (
                <Button onClick={handleSendOtp} disabled={sendingOtp}>
                  {sendingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                      OTP...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    onClick={handleVerifyOtpAndRegister}
                    disabled={verifyingOtp}
                  >
                    {verifyingOtp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Verifying...
                      </>
                    ) : (
                      "Submit OTP"
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    disabled={resendTimer > 0}
                    onClick={handleSendOtp}
                  >
                    Resend OTP
                  </Button>
                  {resendTimer > 0 && (
                    <span className="text-sm text-muted-foreground">
                      Resend in {Math.floor(resendTimer / 60)}:
                      {(resendTimer % 60).toString().padStart(2, "0")}
                    </span>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* LOGIN TAB */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login with your credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. john@gmail.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. xyz"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex  gap-9 mt-2">
                <Button disabled={loginIsLoading} onClick={handleLogin}>
                  {loginIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging
                      in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
