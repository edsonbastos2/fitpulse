
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  LayoutAppLayout: typeof import("../../components/layout/AppLayout.vue")['default']
  NuxtWelcome: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyLayoutAppLayout: LazyComponent<typeof import("../../components/layout/AppLayout.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../../../tmp/fitpulse/.pnpm/nuxt@3.21.2_@emnapi+core@1.9.2_@emnapi+runtime@1.9.2_@parcel+watcher@2.5.6_@types+node@22.19._mzaup6w7rgu5qmylqhby2flwyu/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
