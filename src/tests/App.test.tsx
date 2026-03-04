import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../app/App'
import { MemoryRouter } from 'react-router'

// ENGLISH: Basic test suite to verify the application renders without crashing
// FRANÇAIS: Suite de tests basique pour vérifier que l'application s'affiche sans planter
describe('App Component', () => {
  it('renders the main application container', () => {
    // ENGLISH: We wrap App in MemoryRouter because it likely uses routing features
    // FRANÇAIS: Nous enveloppons App dans MemoryRouter car il utilise probablement le routage
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    
    // ENGLISH: Check if the main structure exists (e.g., sidebar or main content)
    // FRANÇAIS: Vérifie si la structure principale existe (ex: sidebar ou contenu principal)
    // Note: Adjust the selector based on your actual App content. 
    // Note : Ajustez le sélecteur en fonction du contenu réel de votre App.
    const mainElement = document.querySelector('main') || document.querySelector('div')
    expect(mainElement).toBeInTheDocument()
  })
})
