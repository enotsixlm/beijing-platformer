// Optional CrazyGames HTML5 SDK v3 wrapper.
// On github.io / standalone hosts the SDK environment is "disabled" — never call
// methods in that state (they throw). On CrazyGames / localhost the calls are live.

let sdk = null
let pendingStart = false

function isEmbedded() {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

export function pickLang() {
  const q = new URLSearchParams(location.search).get('lang')
  if (q === 'en' || q === 'zh') return q
  if (isEmbedded()) return 'en'
  return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'zh'
}

function loadSdkScript() {
  return new Promise((resolve) => {
    if (window.CrazyGames?.SDK) {
      resolve(true)
      return
    }
    const s = document.createElement('script')
    s.src = 'https://sdk.crazygames.com/crazygames-sdk-v3.js'
    s.async = true
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.head.appendChild(s)
  })
}

function shouldUseSdk() {
  const q = new URLSearchParams(location.search)
  if (q.get('useLocalSdk') === 'true') return true
  const host = location.hostname.toLowerCase()
  if (host.includes('crazygames')) return true
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

export async function initCrazyGames() {
  try {
    if (!shouldUseSdk()) return null
    const loaded = await loadSdkScript()
    if (!loaded) return null
    const CG = window.CrazyGames?.SDK
    if (!CG?.init) return null
    await CG.init()
    if (CG.environment === 'disabled') return null
    sdk = CG
    try {
      sdk.game.loadingStart()
    } catch {
      /* loadingStart is optional */
    }
    if (pendingStart) {
      pendingStart = false
      try {
        sdk.game.gameplayStart()
      } catch {
        /* gameplayStart is best-effort */
      }
    }
    return sdk
  } catch {
    return null
  }
}

function call(fn) {
  try {
    fn()
  } catch {
    /* SDK missing or disabled */
  }
}

export function loadingStop() {
  call(() => sdk?.game.loadingStop())
}

export function gameplayStart() {
  if (!sdk) {
    pendingStart = true
    return
  }
  call(() => sdk.game.gameplayStart())
}

export function gameplayStop() {
  call(() => sdk?.game.gameplayStop())
}

export function happytime() {
  call(() => sdk?.game.happytime())
}

export function isCrazyGames() {
  return sdk?.environment === 'crazygames'
}
