import { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "wouter";
import { Building2, Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="font-serif font-bold text-2xl">VenGrow</span>
              </Link>
              
              <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-destructive/10 mb-6">
                <AlertTriangle className="h-16 w-16 text-destructive" />
              </div>

              <h2 className="font-serif font-bold text-3xl mb-3">
                Oops! Something Went Wrong
              </h2>
              <p className="text-muted-foreground mb-8">
                We encountered an unexpected error. Please try refreshing the page or go back to the home page.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="text-left bg-card border rounded-md p-4 mb-6 overflow-auto max-h-48">
                  <p className="text-sm font-mono text-destructive">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleRefresh} className="w-full sm:w-auto" data-testid="button-refresh">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto" data-testid="button-home">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground mt-6">
                If the problem persists, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
