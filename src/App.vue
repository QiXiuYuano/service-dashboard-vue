<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-500">

    
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- 头部 -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-4">
          七修远的服务导航站
        </h1>
        <div class="inline-flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 glass-effect px-6 py-3 rounded-full border border-white/20 dark:border-gray-700/50">
          <span class="flex items-center">
            <span class="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
            共 {{ services.length }} 个服务
          </span>
          <span class="flex items-center">
            <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            {{ onlineServices }} 个在线
          </span>

          <!-- 检测状态显示 -->
          <div v-if="isChecking" class="flex items-center">
            <div class="w-2 h-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span class="text-xs text-blue-600 dark:text-blue-400">
              检测中 {{ checkingCount }}/{{ services.length }}
            </span>
          </div>
          <button
            v-if="!isChecking"
            @click="manualCheck"
            :disabled="!isMonitoring"
            class="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 text-xs shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:transform-none"
            title="立即检测"
          >
            检测服务状态
          </button>
        </div>
      </div>

      <!-- 搜索和筛选区域 -->
      <div class="mb-8 max-w-4xl mx-auto animate-slide-in">
        <!-- 搜索框 -->
        <div class="mb-4">
          <div class="relative max-w-md mx-auto">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="搜索服务名称或描述..."
              class="w-full px-4 py-3 pl-10 pr-12 rounded-2xl border border-gray-200 dark:border-gray-700 glass-effect text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <svg class="absolute left-3 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            <!-- 分类选择按钮 -->
            <button
              @click="showCategories = !showCategories"
              class="absolute right-3 top-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
              title="选择分类"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 分类选择弹出窗口 -->
        <transition name="fade-scale">
          <div v-if="showCategories" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click="showCategories = false">
            <div class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 max-w-lg w-full mx-4 transform transition-all duration-300" @click.stop>
              <!-- 标题栏 -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">选择分类</h3>
                </div>
                <button
                  @click="showCategories = false"
                  class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:scale-110"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <!-- 分类按钮网格 -->
              <div class="grid grid-cols-1 gap-4 mb-6">
                <button
                  v-for="category in ['全部', ...categories]"
                  :key="category"
                  @click="selectCategory(category)"
                  :class="[
                    'group relative px-6 py-4 rounded-2xl font-medium transition-all duration-300 text-left overflow-hidden',
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/30 transform scale-105 ring-2 ring-blue-400/50' 
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg hover:scale-105'
                  ]"
                >
                  <!-- 选中状态的装饰元素 -->
                  <div v-if="selectedCategory === category" class="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <div v-if="selectedCategory === category" class="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                  
                  <div class="flex items-center justify-between relative z-10">
                    <div class="flex items-center space-x-3">
                      <div :class="[
                        'w-3 h-3 rounded-full transition-all duration-300',
                        selectedCategory === category 
                          ? 'bg-white/80' 
                          : 'bg-blue-400 group-hover:bg-blue-500'
                      ]"></div>
                      <span class="text-lg font-semibold">{{ category === '全部' ? '全部服务' : category }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="category !== '全部'" :class="[
                        'px-3 py-1 rounded-full text-sm font-medium transition-all duration-300',
                        selectedCategory === category 
                          ? 'bg-white/20 text-white' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      ]">
                        {{ getCategoryCount(category) }}
                      </span>
                      <svg v-if="selectedCategory === category" class="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
              
              <!-- 底部操作 -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  当前选择: <span class="font-medium text-gray-700 dark:text-gray-300">{{ selectedCategory === '全部' ? '全部服务' : selectedCategory }}</span>
                </span>
                <button
                  @click="showCategories = false"
                  class="px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 服务网格 -->
      <transition-group name="grid" tag="div">
        <div
          v-if="filteredServices.length"
          key="grid"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in"
        >
          <ServiceCard
            v-for="service in filteredServices"
            :key="service.id"
            :service="service"
            class="animate-fade-in"
          />
        </div>

        <!-- 空状态 -->
        <div
          v-else
          key="empty"
          class="text-center py-16 animate-fade-in"
        >
          <div class="text-6xl mb-6 animate-bounce-subtle">🔍</div>
          <h3 class="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
            未找到匹配的服务
          </h3>
          <p class="text-gray-500 dark:text-gray-500 mb-6 max-w-md mx-auto">
            尝试调整搜索条件或选择其他分类，也可以重置所有筛选条件
          </p>
          <button
            @click="resetFilters"
            class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 active:scale-95"
          >
            重置筛选条件
          </button>
        </div>
      </transition-group>
    </div>
    
    <!-- PWA安装提示组件 -->
    <PWAInstall />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import ServiceCard from './components/ServiceCard.vue'
import PWAInstall from './components/PWAInstall.vue'
import { services as servicesData, categories, checkAllServices } from './data/services.js'

export default {
  name: 'App',
  components: {
    ServiceCard,
    PWAInstall
  },
  setup() {
    const searchTerm = ref('')
    const selectedCategory = ref('全部')
    const showCategories = ref(false)
    const isMonitoring = ref(false)
    const isChecking = ref(false)
    const checkingCount = ref(0)
    
    // 将services转换为响应式引用
    const services = ref([...servicesData])

    const filteredServices = computed(() => {
      return services.value.filter(service => {
        const matchesCategory = selectedCategory.value === '全部' || service.category === selectedCategory.value
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                             service.description.toLowerCase().includes(searchTerm.value.toLowerCase())
        return matchesCategory && matchesSearch
      })
    })

    const onlineServices = computed(() => {
      return services.value.filter(s => s.status === 'online').length
    })

    const getCategoryCount = (category) => {
      return services.value.filter(s => s.category === category).length
    }

    const selectCategory = (category) => {
      selectedCategory.value = category
      showCategories.value = false
    }

    const resetFilters = () => {
      searchTerm.value = ''
      selectedCategory.value = '全部'
      showCategories.value = false
    }

    // 启动服务监测
    const startMonitoring = async () => {
      if (isMonitoring.value) return
      
      isMonitoring.value = true
      console.log('🚀 启动服务状态监测...')
      
      // 立即检测一次
      try {
        isChecking.value = true
        checkingCount.value = 0
        
        await checkAllServices(services.value, (current, total) => {
          checkingCount.value = current;
        });
        
        console.log('初始检测完成');
      } catch (error) {
        console.error('初始检测失败:', error);
      } finally {
        isChecking.value = false
        checkingCount.value = 0
      }
      
      // 每5分钟检测一次
      setInterval(async () => {
        try {
          await checkAllServices(services.value);
          console.log('定时检测完成');
        } catch (error) {
          console.error('定时检测失败:', error);
        }
      }, 300000)
    }

    // 手动触发服务状态检测
    const manualCheck = async () => {
      if (!isMonitoring.value) {
        console.warn('服务状态监测未启动，请先启动。')
        return
      }
      
      isChecking.value = true
      checkingCount.value = 0
      
      try {
        await checkAllServices(services.value, (current, total) => {
          checkingCount.value = current;
        });
        console.log('手动触发服务状态检测完成。')
      } catch (error) {
        console.error('手动检测失败:', error);
      } finally {
        isChecking.value = false
        checkingCount.value = 0
      }
    }

    // 深色模式支持
    onMounted(() => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        document.documentElement.classList.add('dark')
      }
      
      // 监听系统主题变化
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      })

      // 启动服务监测
      startMonitoring()
    })

    return {
      services,
      categories,
      searchTerm,
      selectedCategory,
      showCategories,
      filteredServices,
      onlineServices,
      getCategoryCount,
      selectCategory,
      resetFilters,
      isMonitoring,
      manualCheck,
      isChecking,
      checkingCount
    }
  }
}
</script>

<style scoped>
/* 过渡动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.grid-enter-active {
  transition: all 0.5s ease-out;
}

.grid-leave-active {
  transition: all 0.3s ease-in;
}

.grid-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.grid-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 弹出窗口动画 */
.fade-scale-enter-active {
  transition: all 0.2s ease-out;
}

.fade-scale-leave-active {
  transition: all 0.15s ease-in;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
