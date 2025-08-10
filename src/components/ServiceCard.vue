<template>
  <div
    @click="openService"
    class="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
    :class="[
      'glass-effect border border-white/20 dark:border-gray-700/50',
      service.status === 'online' 
        ? 'shadow-ios hover:shadow-ios-hover dark:shadow-ios-dark dark:hover:shadow-ios-dark-hover' 
        : 'shadow-lg opacity-75 hover:opacity-90'
    ]"
  >
    <!-- 背景渐变效果 -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div class="relative p-6">
      <!-- 图标和标题区域 -->
      <div class="flex items-start mb-4">
        <div class="flex-shrink-0">
          <!-- 服务Logo -->
          <div class="relative">
            <img 
              :src="service.logo" 
              :alt="`${service.name} Logo`"
              @error="handleLogoError"
              class="w-12 h-12 rounded-xl object-cover group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg"
            />
            <!-- Logo加载失败时的备用显示 -->
            <div v-if="logoLoadFailed" class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 group-hover:scale-110 transition-all duration-300">
              <span class="text-2xl group-hover:animate-bounce-subtle">{{ service.icon }}</span>
            </div>
          </div>
        </div>
        <div class="ml-4 flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {{ service.name }}
          </h3>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {{ service.category }}
          </span>
        </div>
      </div>
      
      <!-- 描述 -->
      <div class="service-description mb-4 flex items-start">
        <p class="description-text text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1 min-w-0">
          {{ formatDescription(service.description) }}
        </p>
      </div>
      
      <!-- 底部状态和链接 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <div :class="[
            'w-2 h-2 rounded-full mr-2', // 调整左下角标志大小和右上角的一样大
            service.status === 'online' ? 'bg-green-400' : 
            service.status === 'offline' ? 'bg-red-400' : 'bg-yellow-400'
          ]"></div>
          <!-- 最后检测时间 -->
          <span v-if="service.lastCheck" class="ml-2 text-gray-400">
            上次刷新时间 {{formatLastCheck(service.lastCheck) }} <!-- 修改监测时间文本 -->
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceCard',
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      logoLoadFailed: false
    }
  },
  methods: {
    openService() {
      window.open(this.service.url, '_blank', 'noopener,noreferrer')
    },
    formatLastCheck(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) {
        return `${diffInSeconds} 秒前`;
      } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)} 分钟前`;
      } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)} 小时前`;
      } else {
        return `${Math.floor(diffInSeconds / 86400)} 天前`;
      }
    },
    handleLogoError() {
      console.log(`Logo加载失败: ${this.service.name}`);
      this.logoLoadFailed = true;
    },
    formatDescription(description) {
      if (!description) return '';
      // 在中英文字符之间添加空格
      return description
        .replace(/([a-zA-Z])([\u4e00-\u9fa5])/g, '$1 $2')  // 英文后跟中文
        .replace(/([\u4e00-\u9fa5])([a-zA-Z])/g, '$1 $2')  // 中文后跟英文
        .replace(/([0-9])([\u4e00-\u9fa5])/g, '$1 $2')     // 数字后跟中文
        .replace(/([\u4e00-\u9fa5])([0-9])/g, '$1 $2')     // 中文后跟数字
        .replace(/\s+/g, ' ')                               // 合并多个空格
        .trim();
    }
  }
}
</script>

<style scoped>
.service-description {
  /* 确保描述区域有最小高度，使一行和多行文本对齐一致 */
  min-height: 2.5rem; /* 约40px，大约是两行文本的高度 */
}

.description-text {
  /* 文本会根据内容自然换行，但保持在容器内 */
  word-break: break-word;
  line-height: 1.5;
}
</style>