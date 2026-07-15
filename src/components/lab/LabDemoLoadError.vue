<template>
  <div class="flex min-h-64 flex-col items-center justify-center gap-3 text-center" role="alert">
    <p class="font-medium text-slate-800">演示加载失败</p>
    <p class="text-sm text-slate-500">请检查网络后重新加载，或返回实验室选择其他效果。</p>
    <div class="flex flex-wrap justify-center gap-3">
      <a
        href=""
        class="inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        重新加载演示
      </a>
      <a
        href="/lab"
        class="inline-flex min-h-11 items-center rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        返回交互实验室
      </a>
    </div>
  </div>
</template>
