import { Component } from 'react'

/**
 * ErrorBoundary
 * =============
 * A malformed shared URL or a corrupt garage entry should never leave the
 * user staring at a blank page. This catches render errors and offers a way
 * back. Error boundaries have to be class components - this is the one place
 * React still requires it.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div
        style={{
          maxWidth: 480,
          margin: '80px auto',
          padding: 28,
          textAlign: 'center',
          background: 'var(--bg-1)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-lg)',
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Something came loose</h2>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 18 }}>
          That build couldn&rsquo;t be rendered. It was probably a bad share link.
        </p>
        <button
          type="button"
          onClick={() => {
            window.location.href = '/'
          }}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Start a fresh build
        </button>
      </div>
    )
  }
}
