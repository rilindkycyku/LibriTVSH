import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-5">
          <h5 className="fw-bold text-danger mb-2">Ndodhi një gabim</h5>
          <p className="text-muted">Ju lutem rifreskoni faqen dhe provoni përsëri.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
