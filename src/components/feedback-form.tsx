
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { toast } from "sonner"
import { PlusCircle } from "lucide-react"
import type { FeedbackItem } from "../App"

interface FeedbackFormProps {
  onSubmit: (feedback: Omit<FeedbackItem, 'id' | 'votes' | 'createdAt'>) => void
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<FeedbackItem['category']>('feature')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error("Please enter a title")
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      onSubmit({
        title,
        description,
        category,
      })
      
      // Reset form
      setTitle("")
      setDescription("")
      setCategory('feature')
      setIsSubmitting(false)
      
      toast.success("Feedback submitted successfully!")
    }, 500)
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-primary" />
          Submit Feedback
        </CardTitle>
        <CardDescription>
          Share your ideas, report bugs, or suggest improvements
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a clear, concise title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details about your feedback..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as FeedbackItem['category'])}
            >
              <SelectTrigger id="category" className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="improvement">Improvement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full transition-all duration-200 hover:shadow-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Submitting...</span>
                <span className="animate-pulse">•••</span>
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}