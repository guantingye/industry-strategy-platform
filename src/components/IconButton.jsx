import React from 'react'

export default function IconButton({ onClick, title, children }) {
  return (
    <button
      className="btn btn-ghost h-10 w-10 p-0"
      onClick={onClick}
      title={title}
      aria-label={title}
      type="button"
    >
      {children}
    </button>
  )
}
