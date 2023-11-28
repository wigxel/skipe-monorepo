import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "~/components/ui/select";

export function CategoryDropdown() {
  return (
    <Select name={"category"}>
      <SelectTrigger className="w-full rounded-xl !py-6">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Electronics</SelectLabel>
          <SelectItem value="electronics">Electronics</SelectItem>
          <SelectItem value="computer">Computers</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectItem disabled value="groceries">
            Groceries
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
