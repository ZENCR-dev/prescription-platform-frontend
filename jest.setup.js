import '@testing-library/jest-dom'

// Ensure React 18 testing environment is configured for act()
// See: https://react.dev/warnings/react-dom-test-utils
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Suppress React act warnings in test environment
// We handle async state updates properly at the component level
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to') &&
      args[0].includes('was not wrapped in act')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Increase default Jest timeout for async-heavy integration tests
jest.setTimeout(20000)

// Enhanced fetch polyfill for testing environment
// Provides comprehensive fetch API mock to eliminate environment noise
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Map(),
      json: async () => ({}),
      text: async () => '',
      blob: async () => new Blob(),
      arrayBuffer: async () => new ArrayBuffer(0),
      clone: () => ({ ok: true, json: async () => ({}) })
    })
  )
  
  // Add fetch to window for browser compatibility
  if (typeof window !== 'undefined') {
    window.fetch = global.fetch
  }
}