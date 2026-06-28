<template>
  <section
    ref="sectionRef"
    class="py-16 md:py-24 relative overflow-hidden"
    style="background-color: #f8fafc"
  >
    <!-- 背景装饰 - 纯色块 -->
    <div class="absolute inset-0">
      <!-- 左上角橙色块 -->
      <div class="absolute top-0 left-0 w-96 h-96 opacity-5" style="background-color: #f97316"></div>
      <!-- 右下角青色块 -->
      <div class="absolute bottom-0 right-0 w-64 h-64 opacity-5" style="background-color: #06b6d4"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <!-- 个性化文案 -->
        <h2
          ref="titleRef"
          class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          style="color: #0f172a"
        >
          有项目想法？<br />
          <span style="color: #f97316">让我们聊聊</span>
        </h2>

        <p
          ref="descriptionRef"
          class="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
          style="color: #64748b"
        >
          从企业官网到 SaaS 平台，从微信小程序到数据可视化，我都能提供专业的技术方案。
          如果您有项目想法，或者想了解更多，欢迎随时联系。
        </p>

        <!-- CTA 按钮 - 纯色背景 -->
        <div ref="ctaRef" class="flex flex-col sm:flex-row gap-4 justify-center">
          <CTA
            href="/contact"
            variant="accent"
            size="large"
            label="联系我"
          >
            联系我
          </CTA>
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
        <div ref="contactRef" class="mt-12 flex flex-wrap justify-center gap-6">
          <a
            :href="'mailto:' + contactStore.contact.email"
            class="flex items-center transition-colors duration-300"
          >
            <Mail class="w-5 h-5 mr-2" />
            {{ contactStore.contact.email }}
          </a>
          <a
            :href="'tel:' + contactStore.contact.phone.replace(/\D/g, '')"
            class="flex items-center transition-colors duration-300"
          >
            <Phone class="w-5 h-5 mr-2" />
            {{ contactStore.contact.phone }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import { useContactInfoStore } from '@/stores/useContactInfoStore'
import { Mail, Phone } from 'lucide-vue-next'
import CTA from '@/components/ui/CTA.vue'

const contactStore = useContactInfoStore()

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const contactRef = ref<HTMLElement | null>(null)

const { fadeInUp, staggerIn } = useGSAPAnimations()

onMounted(() => {
  // 在 DOM 更新后执行动画
  nextTick(() => {
    // 标题动画
    if (titleRef.value) {
      fadeInUp(titleRef.value, { duration: 0.8, delay: 0.1 })
    }

    // 描述动画
    if (descriptionRef.value) {
      fadeInUp(descriptionRef.value, { duration: 0.8, delay: 0.2 })
    }

    // CTA 按钮动画
    if (ctaRef.value) {
      const buttons = ctaRef.value.querySelectorAll('.cta-button')
      if (buttons.length > 0) {
        staggerIn(buttons, { duration: 0.6, delay: 0.3 })
      }
    }

    // 联系方式动画
    if (contactRef.value) {
      const contacts = contactRef.value.querySelectorAll('a')
      if (contacts.length > 0) {
        staggerIn(contacts, { duration: 0.6, delay: 0.5 })
      }
    }
  })
})
</script>