"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FilterIcon, RotateCcw } from "lucide-react"


export default function ForumFilter({ onFilterChange }) {
  const [selectedRoles, setSelectedRoles] = useState([])
  const [timeSort, setTimeSort] = useState("newest")

  const handleRoleChange = (role) => {
    setSelectedRoles((prev) => {
      const newRoles = prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]

      onFilterChange({ roles: newRoles, timeSort })
      return newRoles
    })
  }

  const handleTimeSortChange = (value) => {
    setTimeSort(value)
    onFilterChange({ roles: selectedRoles, timeSort: value })
  }

  const resetFilters = () => {
    setSelectedRoles([])
    setTimeSort("newest")
    onFilterChange({ roles: [], timeSort: "newest" })
  }

  return (
    <Card className="w-full lg:w-64 h-fit sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FilterIcon className="w-5 h-5 text-blue-500" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Posted by</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="student"
                  checked={selectedRoles.includes("Student")}
                  onCheckedChange={() => handleRoleChange("Student")}
                />
                <Label htmlFor="student" className="text-sm text-gray-600 dark:text-gray-300">
                  Student
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="admin"
                  checked={selectedRoles.includes("Admin")}
                  onCheckedChange={() => handleRoleChange("Admin")}
                />
                <Label htmlFor="admin" className="text-sm text-gray-600 dark:text-gray-300">
                  Admin
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="instructor"
                  checked={selectedRoles.includes("Instructor")}
                  onCheckedChange={() => handleRoleChange("Instructor")}
                />
                <Label htmlFor="instructor" className="text-sm text-gray-600 dark:text-gray-300">
                  Instructor
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by time</h3>
            <RadioGroup value={timeSort} onValueChange={handleTimeSortChange} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="newest" />
                <Label htmlFor="newest" className="text-sm text-gray-600 dark:text-gray-300">
                  Newest first
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oldest" id="oldest" />
                <Label htmlFor="oldest" className="text-sm text-gray-600 dark:text-gray-300">
                  Oldest first
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
