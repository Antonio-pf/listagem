import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MessageSkeleton() {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          {/* Avatar skeleton */}
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          
          <div className="flex-1 min-w-0 space-y-2">
            {/* Name and date skeleton */}
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            
            {/* Message text skeleton - 2-3 lines */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
