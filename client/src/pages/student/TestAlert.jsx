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

const TestAlert = ({onContinue,startTime,endTime,disabled,children}) => {
  function isValidDate(d) {
    return d && !isNaN(new Date(d));
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This test is available between:
            <br />
            <b>Start:</b> { isValidDate(startTime)? new Date(startTime).toLocaleString():"N/A"}
            <br />
            <b>End:</b> {isValidDate(endTime)?new Date(endTime).toLocaleString():"N/A"}
            
          </AlertDialogDescription>
          {!disabled ? (
              <div className="text-green-600 mt-2">You can start now!</div>
            ) : (
              <div className="text-red-600 mt-2">
                Test is not currently available.
              </div>
            )}
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
