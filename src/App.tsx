
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

// Sample feedback data
const sampleFeedback: FeedbackItem[] = [
  {
    id: '1',
    title: 'Add dark mode support',
    description: 'It would be great to have a dark mode option for better visibility in low-light environments.',
    category: 'feature',
    votes: 15,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    id: '2',
    title: 'Fix login button on mobile',
    description: 'The login button is not working properly on mobile devices. It disappears when tapped.',
    category: 'bug',
    votes: 8,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: '3',
    title: 'Improve loading speed',
    description: 'The app takes too long to load on slower connections. Please optimize performance.',
    category: 'improvement',
    votes: 12,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    id: '4',
    title: 'Add export to CSV feature',
    description: 'Would be helpful to export data to CSV for further analysis in spreadsheets.',
    category: 'feature',
    votes: 6,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: '5',
    title: 'Documentation needs updating',
    description: 'The API documentation is outdated and missing some of the newer endpoints.',
    category: 'other',
    votes: 4,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  }
];

function App() {
  // State for feedback items with proper initialization
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(() => {
    try {
      const savedItems = localStorage.getItem('feedbackItems')
      if (savedItems) {
        // Parse the saved items and convert date strings back to Date objects
        return JSON.parse(savedItems, (key, value) => {
          if (key === 'createdAt') return new Date(value)
          return value
        })
      }
    } catch (error) {
      console.error('Error loading feedback from localStorage:', error)
      // Clear potentially corrupted data
      localStorage.removeItem('feedbackItems')
    }
    // Return sample data if no saved items or error occurred
    return sampleFeedback
  })
  
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  // Save feedback items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('feedbackItems', JSON.stringify(feedbackItems))
    } catch (error) {
      console.error('Error saving feedback to localStorage:', error)
    }
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
  
  // Clear localStorage and reset to sample data (for testing)
  const resetToSampleData = () => {
    localStorage.removeItem('feedbackItems')
    setFeedbackItems(sampleFeedback)
  }
  
  // For development purposes, reset data on first load
  useEffect(() => {
    resetToSampleData()
    // This effect should only run once on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
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