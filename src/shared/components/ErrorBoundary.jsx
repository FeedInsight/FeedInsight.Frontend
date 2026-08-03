import { Component } from 'react'
import Card from '@shared/components/ui/Card.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-[400px] w-full items-center justify-center p-6">
          <Card className="flex max-w-lg flex-col items-center gap-4 p-8 text-center border-red-200 bg-red-50/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Something went wrong</h2>
              <p className="mt-1 text-sm text-slate-600">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Button size="sm" onClick={this.handleReset}>
                <RefreshCw size={14} className="mr-1" /> Try Again
              </Button>
              <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
