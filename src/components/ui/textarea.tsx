import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-transparent placeholder:text-zinc-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 hover:outline hover:outline-2 hover:outline-blue-500/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-slate-800/5 shadow-inner flex field-sizing-content min-h-10 w-full rounded-md px-3 py-2 text-lg transition-[color,box-shadow] outline-none focus:placeholder:opacity-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-lg",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
