// 模拟检测模式（用于测试）
const SIMULATION_MODE = false; // 设置为 false 启用真实检测模式

// 服务状态检测函数
export const checkServiceStatus = async (url) => {
  // 模拟模式：随机返回状态用于测试
  if (SIMULATION_MODE) {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000)); // 模拟网络延迟
    return Math.random() > 0.3 ? 'online' : 'offline'; // 70%概率在线
  }
  
  try {
    // 方法1: 尝试fetch请求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时
    
    const response = await fetch(url, { 
      method: 'GET',
      mode: 'no-cors',
      signal: controller.signal,
      cache: 'no-cache'
    });
    
    clearTimeout(timeoutId);
    return 'online';
    
  } catch (error) {
    console.log(`Fetch检测服务 ${url} 失败:`, error.message);
    
    // 方法2: 尝试图片检测
    try {
      const result = await checkServiceWithImage(url);
      return result;
    } catch (imgError) {
      console.log(`图片检测也失败:`, imgError.message);
      
      // 方法3: 尝试ping检测（通过创建script标签）
      try {
        const result = await checkServiceWithScript(url);
        return result;
      } catch (scriptError) {
        console.log(`Script检测也失败:`, scriptError.message);
        return 'offline';
      }
    }
  }
};

// 备用检测方法1：通过图片加载检测
const checkServiceWithImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timeoutId = setTimeout(() => {
      img.src = '';
      resolve('offline');
    }, 5000);
    
    img.onload = () => {
      clearTimeout(timeoutId);
      resolve('online');
    };
    
    img.onerror = () => {
      clearTimeout(timeoutId);
      resolve('offline');
    };
    
    // 尝试加载favicon或一个小的图片
    img.src = url + '/favicon.ico?' + Date.now();
  });
};

// 备用检测方法2：通过script标签检测
const checkServiceWithScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timeoutId = setTimeout(() => {
      document.head.removeChild(script);
      resolve('offline');
    }, 5000);
    
    script.onload = () => {
      clearTimeout(timeoutId);
      document.head.removeChild(script);
      resolve('online');
    };
    
    script.onerror = () => {
      clearTimeout(timeoutId);
      document.head.removeChild(script);
      resolve('offline');
    };
    
    script.src = url + '?' + Date.now();
    document.head.appendChild(script);
  });
};

// 并发检测所有服务状态
export const checkAllServices = async (services, onProgress) => {
  const promises = services.map(async (service, index) => {
    try {
      if (onProgress) onProgress(index + 1, services.length);
      
      console.log(`开始检测服务: ${service.name} (${service.url})`);
      const status = await checkServiceStatus(service.url);
      
      // 使用Vue的响应式更新方式
      Object.assign(service, {
        status: status,
        lastCheck: new Date()
      });
      
      console.log(`服务 ${service.name} 检测完成: ${status}`);
      
    } catch (error) {
      console.error(`检测服务 ${service.name} 时发生错误:`, error);
      Object.assign(service, {
        status: 'offline',
        lastCheck: new Date()
      });
    }
  });
  
  await Promise.all(promises);
  console.log('所有服务检测完成');
};

export const services = [
  {
    id: "0",
    name: "我的GitHub",
    description: "QiXiuYuano的GitHub主页",
    url: "https://github.com/QiXiuYuano",
    icon: "🐙",
    logo: "https://img.630226.xyz/file/blog/github.png",
    category: "个人",
    status: "checking",
    lastCheck: null
  },
  {
    id: "1",
    name: "服务监控",
    description: "基于Uptime kuma的服务监控状态系统",
    url: "https://status.630226.xyz/status/qi-status",
    icon: "🔍",
    logo: "https://img.630226.xyz/file/logo/GeNie.png",
    category: "监控",
    status: "checking", // 改为checking状态
    lastCheck: null
  },
  {
    id: "2",
    name: "探针",
    description: "自托管、轻量级服务器和网站监控和运维工具",
    url: "https://tz.630226.xyz/",
    icon: "📊",
    logo: "https://img.630226.xyz/file/logo/nezha-logo.png",
    category: "监控",
    status: "checking", // 改为checking状态
    lastCheck: null
  },
  {
    id: "3",
    name: "图床",
    description: "基于 CloudFlare 的开源文件托管解决方案（图床/文件床/网盘）",
    url: "https://img.630226.xyz/",
    icon: "🖼️",
    logo: "https://img.630226.xyz/file/logo/GeNie.png",
    category: "工具",
    status: "checking", // 改为checking状态
    lastCheck: null
  },
  {
    id: "4",
    name: "Danmaku",
    description: "一个功能强大的自托管弹幕（Danmaku）聚合与管理服务",
    url: "https://danmu.630226.xyz/",
    icon: "💬",
    logo: "https://img.630226.xyz/file/logo/danmu-logo.png",
    category: "娱乐",
    status: "checking", // 改为checking状态
    lastCheck: null
  }
]

export const categories = ["个人", "监控", "工具", "娱乐"]
