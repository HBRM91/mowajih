import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
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
    console.error("Admin ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center max-w-md">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Erreur du tableau de bord</h2>
            <p className="text-sm text-slate-500 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-tawjih-600 text-white rounded-lg text-sm font-medium hover:bg-tawjih-700"
            >
              Recharger
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
