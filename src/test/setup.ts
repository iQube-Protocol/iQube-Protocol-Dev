// Test setup file
// This can include global test configurations, mocks, etc.
import { expect } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)
