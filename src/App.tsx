import { useStore } from './store/useStore'
import HomeScreen from './screens/HomeScreen'
import CanvasScreen from './screens/CanvasScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  const { screen, toast } = useStore()

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {screen === 'home'     && <HomeScreen />}
      {screen === 'canvas'   && <CanvasScreen />}
      {screen === 'settings' && <SettingsScreen />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
