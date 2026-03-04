import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect method with methods from react-testing-library
// Étendre la méthode expect de Vitest avec les méthodes de react-testing-library
expect.extend(matchers)

// Runs a cleanup after each test case (e.g. clearing jsdom)
// Nettoie après chaque test (ex: nettoyage de jsdom)
afterEach(() => {
  cleanup()
})
