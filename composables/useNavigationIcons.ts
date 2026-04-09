import type { Component } from 'vue'
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  CalendarIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline'

const iconMap: Record<string, Component> = {
  home: HomeIcon,
  dumbbell: WrenchScrewdriverIcon,
  exercises: WrenchScrewdriverIcon,
  calendar: CalendarIcon,
  chart: ChartBarIcon,
  user: UserIcon,
  settings: Cog6ToothIcon,
}

/** Retorna o componente de ícone pelo nome. Fallback para HomeIcon. */
export function useNavigationIcons() {
  const getIcon = (name: string): Component => {
    return iconMap[name] || HomeIcon
  }

  return { getIcon }
}
