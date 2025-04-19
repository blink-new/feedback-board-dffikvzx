
import { ChevronUp, MessageSquare, Loader2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { cn } from "../lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { FeedbackItem } from "../App"

interface FeedbackListProps {
  items: FeedbackItem[]
  onVote: (id: string) => void
  isLoading?: boolean
}

export function FeedbackList({ items, onVote, isLoading = false }: FeedbackListProps) {
  // Category badge styles
  const categoryStyles = {
    feature: "bg-blue-500 hover:bg-blue-600",
    bug: "bg-red-500 hover:bg-red-600",
    improvement: "bg-green-500 hover:bg-green-600",
    other: "bg-purple-500 hover:bg-purple-600",
  }
  
  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
    return `${Math.floor(diffInSeconds / 31536000)} years ago`
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Loading feedback...</h2>
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }
  
  // Empty state
  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">No feedback yet</h2>
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No feedback yet</h3>
          <p className="text-muted-foreground mt-2">
            Be the first to submit your ideas or suggestions!
          </p>
        </Card>
      </div>
    )
  }
  
  // Feedback list
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">
        Feedback ({items.length})
      </h2>
      
      <div className="space-y-4">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.05 // Stagger the animations
              }}
            >
              <Card className="overflow-hidden border-transparent hover:border-primary/20 transition-all duration-200 hover:shadow-md">
                <div className="flex">
                  <div className="flex flex-col items-center justify-start p-4 bg-secondary/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      onClick={() => onVote(item.id)}
                    >
                      <ChevronUp className="h-5 w-5" />
                    </Button>
                    <span className="font-bold text-lg">{item.votes}</span>
                  </div>
                  
                  <div className="flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <Badge className={cn("text-white", categoryStyles[item.category])}>
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground">
                        {item.description || "No description provided."}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="text-xs text-muted-foreground pt-0">
                      Submitted {formatRelativeTime(item.createdAt)}
                    </CardFooter>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}