<template>
  <div v-if="showInstallPrompt" class="fixed bottom-4 left-4 right-4 z-50 animate-slide-in">
    <div class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 dark:text-white">安装应用</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">将服务导航台添加到主屏幕</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="installPWA"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 text-sm shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            安装
          </button>
          <button
            @click="dismissInstall"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 更新通知 -->
  <div v-if="showUpdatePrompt" class="fixed top-4 left-4 right-4 z-50 animate-slide-in">
    <div class="bg-green-500/95 backdrop-blur-md rounded-2xl shadow-2xl border border-green-400/50 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-white">发现新版本</h3>
            <p class="text-sm text-green-100">点击刷新获取最新内容</p>
          </div>
        </div>
        <button
          @click="updateApp"
          class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all duration-200 text-sm backdrop-blur-sm"
        >
          刷新
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'PWAInstall',
  setup() {
    const showInstallPrompt = ref(false)
    const showUpdatePrompt = ref(false)
    let deferredPrompt = null
    let updateCallback = null

    const installPWA = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
          console.log('PWA安装成功')
        }
        deferredPrompt = null
        showInstallPrompt.value = false
      }
    }

    const dismissInstall = () => {
      showInstallPrompt.value = false
    }

    const updateApp = () => {
      if (updateCallback) {
        updateCallback()
      }
      showUpdatePrompt.value = false
    }

    onMounted(() => {
      // 监听安装提示
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault()
        deferredPrompt = e
        showInstallPrompt.value = true
      }

      // 监听PWA更新
      const handleControllerChange = () => {
        showUpdatePrompt.value = true
      }

      const handleMessage = (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          updateCallback = () => {
            window.location.reload()
          }
          showUpdatePrompt.value = true
        }
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)
        navigator.serviceWorker.addEventListener('message', handleMessage)
      }

      // 保存引用以便清理
      window._pwaEventHandlers = {
        beforeinstallprompt: handleBeforeInstallPrompt,
        controllerchange: handleControllerChange,
        message: handleMessage
      }
    })

    onUnmounted(() => {
      if (window._pwaEventHandlers) {
        window.removeEventListener('beforeinstallprompt', window._pwaEventHandlers.beforeinstallprompt)
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.removeEventListener('controllerchange', window._pwaEventHandlers.controllerchange)
          navigator.serviceWorker.removeEventListener('message', window._pwaEventHandlers.message)
        }
        delete window._pwaEventHandlers
      }
    })

    return {
      showInstallPrompt,
      showUpdatePrompt,
      installPWA,
      dismissInstall,
      updateApp
    }
  }
}
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style> 