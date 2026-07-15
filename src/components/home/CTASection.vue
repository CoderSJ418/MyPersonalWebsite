<template>
  <section
    class="py-16 md:py-24 relative overflow-hidden cta-section stripe-orbs stripe-orbs--indigo"
    data-effect-consumer="shimmer-button"
  >
    <div class="stripe-orb-extra stripe-orb-extra--violet" style="bottom:-10%;left:30%;" aria-hidden="true"></div>
    <!-- 背景装饰 - 纯色块 -->
    <div class="absolute inset-0">
      <!-- 左上角橙色块 -->
      <div class="absolute top-0 left-0 w-96 h-96 opacity-5 cta-section__deco--orange"></div>
      <!-- 右下角青色块 -->
      <div class="absolute bottom-0 right-0 w-64 h-64 opacity-5 cta-section__deco--cyan"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <!-- 个性化文案 -->
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight cta-section__title">
          有项目想法？<br />
          <span class="cta-section__title-accent">让我们聊聊</span>
        </h2>

        <p class="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed cta-section__desc">
          从企业官网到 SaaS 平台，从微信小程序到数据可视化，我都能提供专业的技术方案。
          如果您有项目想法，或者想了解更多，欢迎随时联系。
        </p>

        <!-- CTA 按钮 - 纯色背景 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <ShimmerButtonDemo
            :href="`mailto:${contact.email}`"
            :duration="0.8"
            label="联系我"
            embedded
          >
            联系我
          </ShimmerButtonDemo>
          <CTA
            href="/resume.pdf"
            variant="secondary"
            size="large"
            label="下载简历"
            download
          >
            下载简历
          </CTA>
        </div>

        <!-- 联系方式 -->
        <div class="mt-12 flex flex-wrap justify-center gap-6">
          <a
            :href="'mailto:' + contact.email"
            class="flex items-center transition-colors duration-300"
          >
            <Mail class="w-5 h-5 mr-2" />
            {{ contact.email }}
          </a>
          <a
            :href="'tel:' + contact.phone.replace(/\D/g, '')"
            class="flex items-center transition-colors duration-300"
          >
            <Phone class="w-5 h-5 mr-2" />
            {{ contact.phone }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import contactInfo from '@/assets/data/contact-info.json'
import { Mail, Phone } from 'lucide-vue-next'
import CTA from '@/components/ui/CTA.vue'
import ShimmerButtonDemo from '@/views/Lab/demos/ShimmerButtonDemo.vue'

const contact = contactInfo
</script>

<style scoped>
/* CTA Section — 使用CSS变量替代内联硬编码hex */
.cta-section {
  background-color: var(--bg-secondary, #f8fafc);
}

.cta-section__deco--orange {
  background-color: var(--accent-amber-500, #f97316);
}

.cta-section__deco--cyan {
  background-color: var(--info-color, #06b6d4);
}

.cta-section__title {
  color: var(--us-text-primary, #0f172a);
}

.cta-section__title-accent {
  color: var(--accent-amber-500, #f97316);
}

.cta-section__desc {
  color: var(--us-text-secondary, #64748b);
}
</style>
