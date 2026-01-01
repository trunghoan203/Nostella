import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GreetingEmptyStateProps {
  onCreate: () => void
}

export function GreetingEmptyState({ onCreate }: GreetingEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
        <Mail className="w-12 h-12 text-secondary" />
      </div>

      <h2 className="font-serif text-2xl font-semibold mb-2">
        No greeting cards yet
      </h2>

      <p className="text-muted-foreground max-w-md mb-6">
        Start spreading joy by sending your first greeting card!
      </p>

      <Button onClick={onCreate} className="rounded-xl gap-2">
        Send a Card
      </Button>
    </div>
  )
}
