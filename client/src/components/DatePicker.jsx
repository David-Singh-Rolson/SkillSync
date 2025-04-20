
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({value,onChange,disabled}) {
	const [date, setDate] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selected) => {
	if (selected) {
	onChange(selected);
	  	setOpen(false); // only close when a valid date is selected
	}
  };

  return (
	<Popover open={open} onOpenChange={setOpen}>
	  <PopoverTrigger asChild>
		<Button
		disabled={disabled}
		  variant="outline"
		  className={cn(
			"w-[180px] h-10 rounded-md border border-input bg-background px-.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
			!value && "text-muted-foreground"
		  )}
		>
		  <CalendarIcon className="mr-2 h-4 w-4" />
		  {value ? format(value, "PPP") : <span>Pick a date</span>}
		</Button>
	  </PopoverTrigger>
	  <PopoverContent className="w-auto p-0" hidden={disabled}>
		<Calendar
		  mode="single"
		  selected={value}
		  onSelect={handleSelect}
		  initialFocus
		/>
	  </PopoverContent>
	</Popover>
  );
}
