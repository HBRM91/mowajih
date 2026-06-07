import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Une erreur est survenue</h2>
            <p className="text-sm text-slate-500 mb-4 max-w-md">
              {this.state.error?.message || "Veuillez rafraîchir la page ou réessayer plus tard."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-tawjih-600 text-white rounded-xl text-sm font-medium hover:bg-tawjih-700"
            >
              Rafraîchir
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
