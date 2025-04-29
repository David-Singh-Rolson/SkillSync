import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";

const TestAlert = ({onContinue,startTime,endTime,disabled,testType,children}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This test is available between:
            <br />
            <b>Start:</b> {new Date(startTime).toLocaleString()}
            <br />
            <b>End:</b> {new Date(endTime).toLocaleString()}
            {!disabled ? (
              <p className="text-green-600 mt-2">You can start now!</p>
            ) : (
              <p className="text-red-600 mt-2">
                Test is not currently available.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction  disabled={disabled}  onClick={onContinue}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TestAlert;
