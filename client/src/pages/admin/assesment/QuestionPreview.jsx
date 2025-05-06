
import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/components/hooks/use-media-query"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default  function QuestionPreview ({open,onOpenChange,question}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* <DialogTrigger asChild>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Preview Mode</DialogTitle>
            <DialogDescription>
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <QuestionPreviewContent question={question} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {/* <DrawerTrigger asChild>
      </DrawerTrigger> */}
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Preview Mode</DrawerTitle>
          <DrawerDescription>
             Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <QuestionPreviewContent className="px-4" question={question}/>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// function QuestionPreviewContent() {
//   return (
//     <form className={cn("grid items-start gap-4")}>
//       <div className="grid gap-2">
//         <Label htmlFor="email">Email</Label>
//         <Input type="email" id="email" defaultValue="shadcn@example.com" />
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="username">Username</Label>
//         <Input id="username" defaultValue="@shadcn" />
//       </div>
//       <Button type="submit">Save changes</Button>
//     </form>
//   )
// }




function QuestionPreviewContent({ question }) {
    return (
      <form className={cn("grid items-start gap-4 max-h-[75vh] overflow-y-auto pr-2")}>
        <div className="grid gap-2">
          <Label>Question Text</Label>
          <Input type="text" value={question.questionText} readOnly />
        </div>
  
        <div className="grid gap-2">
          <Label>Topic</Label>
          <Input type="text" value={question.topic} readOnly />
        </div>
  
        <div className="grid gap-2">
          <Label>Difficulty</Label>
          <Input type="text" value={question.difficulty} readOnly />
        </div>
  
        <div className="grid gap-2">
          <Label>Marks</Label>
          <Input type="number" value={question.marks} readOnly />
        </div>
  
        <div className="grid gap-2">
          <Label>Type</Label>
          <Input type="text" value={question.questionType} readOnly />
        </div>
  
        {(question.questionType === "SingleCorrect" || question.questionType === "MultiCorrect") && (
          <div className="grid gap-2">
            <Label>Options</Label>
            <div className="grid gap-1">
              {question.options.map((opt, idx) => (
                <Input
                  key={idx}
                  type="text"
                  value={opt}
                  readOnly
                  className={
                    question.questionType === "SingleCorrect"
                      ? idx === question.correctOptionIndex
                        ? "border border-primary"
                        : ""
                      : question.correctOptionIndexes.includes(idx)
                      ? "border border-primary"
                      : ""
                  }
                />
              ))}
            </div>
          </div>
        )}
  
        {(question.questionType === "TrueFalse" || question.questionType === "ShortAnswer" || question.questionType === "Integer") && (
          <div className="grid gap-2">
            <Label>Answer</Label>
            <Input
              type="text"
              value={question.correctAnswer || question.answer}
              readOnly
            />
          </div>
        )}
        <div className="flex space-x-1">
        <Button type="button">Edit Question</Button>
        <Button type="submit">Save Question</Button>
        </div>
      </form>
    );
  }
  




