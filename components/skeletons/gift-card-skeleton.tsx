import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function GiftCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/80">
      {/* Image skeleton */}
      <Skeleton className="h-58 sm:h-100 w-full" />
      
      <CardContent className="p-3 sm:p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Description skeleton - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        {/* Button skeleton */}
        <div className="pt-2">
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
