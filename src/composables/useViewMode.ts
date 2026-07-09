/**
 * ViewMode状态管理 — recruit / reader 模式切换
 *
 * 默认recruit模式，用户可切换到reader
 * 状态存储在URL query param中，支持分享/书签
 */

import { ref, computed } from 'vue'
import type { ViewMode } from '@/types/view-contract'

const viewMode = ref<ViewMode>('recruit')

export function useViewMode() {
  const isRecruit = computed(() => viewMode.value === 'recruit')
  const isReader = computed(() => viewMode.value === 'reader')

  function switchToRecruit() {
    viewMode.value = 'recruit'
  }

  function switchToReader() {
    viewMode.value = 'reader'
  }

  function toggleMode() {
    viewMode.value = viewMode.value === 'recruit' ? 'reader' : 'recruit'
  }

  return {
    viewMode,
    isRecruit,
    isReader,
    switchToRecruit,
    switchToReader,
    toggleMode
  }
}