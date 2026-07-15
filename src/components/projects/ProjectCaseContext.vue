<template>
  <section v-if="hasContext" class="pcc" :class="`pcc--${density}`" aria-label="项目职责与协作边界">
    <div class="pcc__identity">
      <div v-if="data.role" class="pcc__identity-item">
        <span class="pcc__label">我的角色</span>
        <strong class="pcc__value">{{ data.role }}</strong>
      </div>
      <div v-if="data.teamContext" class="pcc__identity-item">
        <span class="pcc__label">协作方式</span>
        <span class="pcc__value">{{ data.teamContext }}</span>
      </div>
    </div>

    <div v-if="data.platforms?.length" class="pcc__platforms" aria-label="覆盖平台">
      <span v-for="platform in data.platforms" :key="platform" class="pcc__platform">
        {{ platform }}
      </span>
    </div>

    <div v-if="data.responsibilities?.length" class="pcc__group">
      <h2 class="pcc__title">我的贡献</h2>
      <ul class="pcc__list">
        <li v-for="item in data.responsibilities" :key="item">{{ item }}</li>
      </ul>
    </div>

    <template v-if="density === 'reader'">
      <div v-if="data.teamResults?.length" class="pcc__group">
        <h2 class="pcc__title">团队成果</h2>
        <ul class="pcc__list pcc__list--team">
          <li v-for="item in data.teamResults" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div v-if="data.constraints?.length" class="pcc__group pcc__group--boundary">
        <h2 class="pcc__title">案例边界</h2>
        <ul class="pcc__list pcc__list--plain">
          <li v-for="item in data.constraints" :key="item">{{ item }}</li>
        </ul>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { NarrativeDensity, ProjectCaseView } from '@/types/view-contract'

interface Props {
  data: ProjectCaseView
  density: NarrativeDensity
}

const props = defineProps<Props>()

const hasContext = computed(() =>
  Boolean(
    props.data.role ||
    props.data.teamContext ||
    props.data.platforms?.length ||
    props.data.responsibilities?.length ||
    props.data.teamResults?.length ||
    props.data.constraints?.length
  )
)
</script>

<style scoped>
.pcc {
  display: grid;
  gap: var(--us-space-4);
  margin-bottom: var(--us-space-8);
  padding: var(--us-space-5);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-xl);
}

.pcc--reader {
  margin-top: var(--us-space-4);
}

.pcc__identity {
  display: grid;
  gap: var(--us-space-3);
}

.pcc__identity-item {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-1);
}

.pcc__label,
.pcc__title {
  color: var(--us-accent);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
}

.pcc__value,
.pcc__list {
  color: var(--us-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.pcc__platforms {
  display: flex;
  flex-wrap: wrap;
  gap: var(--us-space-2);
}

.pcc__platform {
  padding: var(--us-space-1) var(--us-space-3);
  color: var(--us-text-secondary);
  background: var(--us-bg-subtle);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
}

.pcc__title {
  margin: 0 0 var(--us-space-2);
}

.pcc__list {
  display: grid;
  gap: var(--us-space-2);
  margin: 0;
  padding-left: var(--us-space-5);
}

.pcc__list--team,
.pcc__list--plain {
  color: var(--us-text-tertiary);
}

.pcc__group--boundary {
  padding-top: var(--us-space-3);
  border-top: 1px solid var(--us-border);
}

@media (min-width: 768px) {
  .pcc__identity {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  }

  .pcc--reader {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pcc--reader .pcc__identity,
  .pcc--reader .pcc__platforms,
  .pcc--reader .pcc__group--boundary {
    grid-column: 1 / -1;
  }
}
</style>
