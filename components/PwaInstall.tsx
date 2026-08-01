'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  type BeforeInstallPromptEvent,
  dismissPrompt,
  isIos,
  isMobileViewport,
  isStandalone,
  wasDismissedRecently,
} from '@/lib/pwa'

type PwaContextValue = {
  ready: boolean
  canInstallNative: boolean
  showSoftPrompt: boolean
  isIosDevice: boolean
  isMobile: boolean
  installed: boolean
  install: () => Promise<void>
  dismiss: () => void
  openHelp: () => void
  helpOpen: boolean
  closeHelp: () => void
}

const PwaContext = createContext<PwaContextValue | null>(null)

export function usePwa() {
  const ctx = useContext(PwaContext)
  if (!ctx) throw new Error('usePwa must be used within PwaProvider')
  return ctx
}

export function PwaProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isIosDevice, setIsIosDevice] = useState(false)
  const [dismissed, setDismissed] = useState(true)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    setInstalled(isStandalone())
    setIsMobile(isMobileViewport())
    setIsIosDevice(isIos())
    setDismissed(wasDismissedRecently())
    setReady(true)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* ignore offline/register failures in dev */
      })
    }

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }

    window.addEventListener('beforeinstallprompt', onBip)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBip)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = useCallback(() => {
    dismissPrompt()
    setDismissed(true)
    setHelpOpen(false)
  }, [])

  const install = useCallback(async () => {
    if (deferred) {
      await deferred.prompt()
      const choice = await deferred.userChoice
      setDeferred(null)
      if (choice.outcome === 'accepted') {
        setInstalled(true)
      } else {
        dismiss()
      }
      return
    }
    setHelpOpen(true)
  }, [deferred, dismiss])

  const showSoftPrompt =
    ready && isMobile && !installed && !dismissed

  const value = useMemo<PwaContextValue>(
    () => ({
      ready,
      canInstallNative: Boolean(deferred),
      showSoftPrompt,
      isIosDevice,
      isMobile,
      installed,
      install,
      dismiss,
      openHelp: () => setHelpOpen(true),
      helpOpen,
      closeHelp: () => setHelpOpen(false),
    }),
    [
      ready,
      deferred,
      showSoftPrompt,
      isIosDevice,
      isMobile,
      installed,
      install,
      dismiss,
      helpOpen,
    ]
  )

  return (
    <PwaContext.Provider value={value}>
      {children}
      {helpOpen && <InstallHelpModal />}
    </PwaContext.Provider>
  )
}

function InstallHelpModal() {
  const { isIosDevice, closeHelp, dismiss, canInstallNative, install } = usePwa()

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="a2hs-title"
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
      >
        <h2 id="a2hs-title" className="text-lg font-bold text-gray-900">
          Dejala en el celu
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Se abre como app, sin buscarla en el navegador. Ideal para cuando estás en la carni
          o con el fuego prendido.
        </p>

        {canInstallNative ? (
          <button
            type="button"
            onClick={() => void install()}
            className="mt-4 w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
          >
            Agregar a inicio
          </button>
        ) : isIosDevice ? (
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-800">
            <li>
              Tocá el botón <strong>Compartir</strong> (el cuadrado con la flecha) en Safari.
            </li>
            <li>
              Elegí <strong>Agregar a pantalla de inicio</strong>.
            </li>
            <li>
              Confirmá con <strong>Agregar</strong>.
            </li>
          </ol>
        ) : (
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-800">
            <li>Abrí el menú del navegador (⋮ o ≡).</li>
            <li>
              Buscá <strong>Instalar app</strong> o <strong>Agregar a pantalla de inicio</strong>.
            </li>
            <li>Confirmá.</li>
          </ol>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={closeHelp}
            className="min-h-11 flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="min-h-11 flex-1 rounded-lg py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            No mostrar más
          </button>
        </div>
      </div>
    </div>
  )
}

export function AddToHomeCard({ className = '' }: { className?: string }) {
  const { showSoftPrompt, install, dismiss, canInstallNative, isIosDevice } = usePwa()

  if (!showSoftPrompt) return null

  return (
    <div
      className={`rounded-lg border border-red-100 bg-red-50 p-4 ${className}`}
    >
      <p className="font-semibold text-red-900">¿La dejamos en el celu?</p>
      <p className="mt-1 text-sm text-red-800">
        Acceso directo a la calculadora: se abre como app, sin vueltas.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => void install()}
          className="min-h-11 flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          {canInstallNative
            ? 'Agregar a inicio'
            : isIosDevice
              ? 'Ver cómo en iPhone'
              : 'Ver cómo'}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="min-h-11 rounded-lg px-4 py-2.5 text-sm font-medium text-red-800 hover:bg-red-100"
        >
          Ahora no
        </button>
      </div>
    </div>
  )
}
