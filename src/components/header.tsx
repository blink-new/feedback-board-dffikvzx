
import { ThemeToggle } from "./theme-toggle"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Lightbulb } from "lucide-react"

interface HeaderProps {
  activeCategory: string | null
  setActiveCategory: (category: string | null) => void
}

export function Header({ activeCategory, setActiveCategory }: HeaderProps) {
  const categories = [
    { id: 'feature', label: 'Feature Request', color: 'bg-blue-500' },
    { id: 'bug', label: 'Bug Report', color: 'bg-red-500' },
    { id: 'improvement', label: 'Improvement', color: 'bg-green-500' },
    { id: 'other', label: 'Other', color: 'bg-purple-500' },
  ]

  return (
    <header className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-primary">Feedback Board</h1>
        </div>
        <ThemeToggle />
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="text-sm font-medium text-muted-foreground mr-2">Filter by:</span>
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
          className="rounded-full"
        >
          All
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="rounded-full"
          >
            <span className={`mr-1.5 h-2 w-2 rounded-full ${category.color}`}></span>
            {category.label}
          </Button>
        ))}
      </div>
    </header>
  )
}