import { createContext, useContext } from 'react'

export const InstructorContext = createContext(null)

export function useInstructor() {
  return useContext(InstructorContext)
}
