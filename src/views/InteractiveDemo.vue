<template>
  <div class="interactive-demo">
    <div class="container mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold mb-8 text-center">交互式效果演示</h1>

      <!-- 自定义光标说明 -->
      <div class="mb-12 p-6 rounded-lg bg-gray-100 dark:bg-gray-800">
        <h2 class="text-2xl font-bold mb-4">自定义光标</h2>
        <p class="mb-4">移动鼠标查看自定义光标效果，悬停在按钮上查看变形效果。</p>
        <MagneticButton class="px-6 py-3 bg-blue-500 text-white rounded-lg">
          悬停查看磁性效果
        </MagneticButton>
      </div>

      <!-- 3D 卡片演示 -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">3D 卡片效果</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card3D :max-tilt="15" :perspective="1000" :scale="1.05" :glare="true">
            <div class="p-6 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <h3 class="text-xl font-bold mb-2">卡片 1</h3>
              <p>悬停查看 3D 倾斜效果</p>
            </div>
          </Card3D>
          <Card3D :max-tilt="15" :perspective="1000" :scale="1.05" :glare="true">
            <div class="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <h3 class="text-xl font-bold mb-2">卡片 2</h3>
              <p>悬停查看 3D 倾斜效果</p>
            </div>
          </Card3D>
          <Card3D :max-tilt="15" :perspective="1000" :scale="1.05" :glare="true">
            <div class="p-6 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 text-white">
              <h3 class="text-xl font-bold mb-2">卡片 3</h3>
              <p>悬停查看 3D 倾斜效果</p>
            </div>
          </Card3D>
        </div>
      </div>

      <!-- 磁性按钮演示 -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">磁性按钮</h2>
        <div class="flex gap-4 flex-wrap">
          <MagneticButton class="px-6 py-3 bg-red-500 text-white rounded-lg">
            红色按钮
          </MagneticButton>
          <MagneticButton class="px-6 py-3 bg-green-500 text-white rounded-lg">
            绿色按钮
          </MagneticButton>
          <MagneticButton class="px-6 py-3 bg-yellow-500 text-white rounded-lg">
            黄色按钮
          </MagneticButton>
        </div>
      </div>

      <!-- 返回首页 -->
      <div class="text-center mt-12">
        <RouterLink to="/" class="px-6 py-3 bg-gray-800 text-white rounded-lg inline-block">
          返回首页
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card3D from '@/components/interactive/Card3D.vue'
import MagneticButton from '@/components/interactive/MagneticButton.vue'
</script>

<style scoped>
.interactive-demo {
  min-height: 100vh;
}
</style>