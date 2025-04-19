
import { useState, useEffect } from 'react'
import { ThemeProvider } from './components/theme-provider'
import { Header } from './components/header'
import { FeedbackForm } from './components/feedback-form'
import { FeedbackList } from './components/feedback-list'
import { Toaster } from './components/ui/sonner'

// Define the feedback item type
export type FeedbackItem = {
  id: string
  title: string
  description: string
  category: 'feature' | 'bug' | 'improvement' | 'other'
  votes: number
  createdAt: Date
}

function App() {
  // State for feedback items
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(() => {
    const savedItems = localStorage.getItem('feedbackItems')
    return savedItems ? JSON.parse(savedItems, (key, value) => {
      if (key === 'createdAt') return new Date(value)
      return value
    }) : []
  })
  
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  // Save feedback items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('feedbackItems', JSON.stringify(feedbackItems))
  }, [feedbackItems])
  
  // Add new feedback
  const addFeedback = (feedback: Omit<FeedbackItem, 'id' | 'votes' | 'createdAt'>) => {
    const newFeedback: FeedbackItem = {
      ...feedback,
      id: crypto.randomUUID(),
      votes: 0,
      createdAt: new Date()
    }
    
    setFeedbackItems(prev => [newFeedback, ...prev])
  }
  
  // Vote for a feedback item
  const voteFeedback = (id: string) => {
    setFeedbackItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    )
  }
  
  // Filter feedback items by category
  const filteredItems = activeCategory 
    ? feedbackItems.filter(item => item.category === activeCategory)
    : feedbackItems
  
  // Sort feedback items by votes (descending)
  const sortedItems = [...filteredItems].sort((a, b) => b.votes - a.votes)
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="feedback-theme">
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Header 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
          <main className="mt-8 grid gap-8 md:grid-cols-[1fr_2fr] lg:grid-cols-[300px_1fr]">
            <div>
              <FeedbackForm onSubmit={addFeedback} />
            </div>
            <div>
              <FeedbackList 
                items={sortedItems} 
                onVote={voteFeedback}
              />
            </div>
          </main>
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App