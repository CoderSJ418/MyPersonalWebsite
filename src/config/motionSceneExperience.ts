import type { LabParam } from '@/types/lab'

interface ScenePresentation {
  styleGroup: string
  interactionHint: string
}

const range = (
  key: string,
  label: string,
  min: number,
  max: number,
  step: number,
  defaultValue: number
): LabParam => ({ key, label, type: 'range', min, max, step, defaultValue })

const sceneParamsById: Record<string, LabParam[]> = {
  'digital-epoch': [range('speed', '自转速度', 0.1, 1.2, 0.05, 0.38), range('depth', '产品景深', 0.3, 1.8, 0.05, 0.95), range('pointerStrength', '视角跟随', 0, 0.8, 0.02, 0.3)],
  'impressive-hero': [range('intensity', '锚点位移', 0.2, 1.2, 0.05, 0.8), range('depth', '锚点尺度', 0.1, 1.2, 0.05, 0.6)],
  'future-3d-portfolio': [range('speed', '漂浮速度', 0.1, 1.2, 0.05, 0.3), range('depth', '项目纵深', 0.3, 1.8, 0.05, 1.3), range('pointerStrength', '相机视差', 0, 0.8, 0.02, 0.42)],
  'nival-cyberspace': [range('speed', '空间漂移', 0.1, 1.2, 0.05, 0.32), range('depth', '项目纵深', 0.3, 1.8, 0.05, 1.4), range('pointerStrength', '指针视差', 0, 0.8, 0.02, 0.42)],
  'cast-and-render': [range('speed', '雕塑转速', 0.1, 1.2, 0.05, 0.22), range('depth', '镜头距离', 0.3, 1.8, 0.05, 1.1), range('pointerStrength', '镜头跟随', 0, 0.8, 0.02, 0.2)],
  alethia: [range('speed', '形体转速', 0.1, 1.2, 0.05, 0.28), range('depth', '玻璃尺度', 0.3, 1.8, 0.05, 1.05), range('pointerStrength', '视角跟随', 0, 0.8, 0.02, 0.24)],
  'particle-field': [range('density', '粒子密度', 12, 96, 2, 82), range('speed', '粒子流速', 0.1, 1.4, 0.05, 0.62), range('pointerStrength', '指针扰动', 0, 1, 0.05, 0.78)],
  'react-vision': [range('density', '节点密度', 12, 96, 2, 48), range('speed', '扫描速度', 0.1, 1.4, 0.05, 0.5), range('pointerStrength', '节点吸附', 0, 1, 0.05, 0.5)],
  codeveil: [range('speed', '滚动推进阻尼', 0.1, 1.2, 0.05, 0.58)],
  consentinel: [range('speed', '滚动响应速度', 0.1, 1.2, 0.05, 0.58)],
  'orbit-stickers': [range('speed', '轨道速度', 0.1, 1.2, 0.05, 0.48), range('depth', '轨道半径', 0.1, 1.2, 0.05, 0.8), range('intensity', '拖拽灵敏度', 0.2, 1.2, 0.05, 0.88)],
  'liquid-glass-agency': [range('depth', '玻璃层级', 0.1, 1.2, 0.05, 0.55), range('intensity', '折射高光', 0.2, 1.2, 0.05, 0.92)],
  'playful-idea': [range('position', '对比分界', 12, 88, 1, 52)],
  'ancient-oath': [range('depth', '主体尺度', 0.1, 1.2, 0.05, 0.7), range('intensity', '形变幅度', 0.2, 1.2, 0.05, 0.82)],
  'space-planet': [range('speed', '行星自转', 0.1, 1.2, 0.05, 0.4), range('depth', '星体尺度', 0.3, 1.8, 0.05, 1.1), range('pointerStrength', '轨道视差', 0, 0.8, 0.02, 0.24)],
  'aetheris-voyage': [range('speed', '地平线推进', 0.1, 1.2, 0.05, 0.24), range('intensity', '大气强度', 0.2, 1.2, 0.05, 0.78), range('scale', '天体尺度', 0.6, 1.8, 0.05, 1.08)],
  'frozen-cave': [range('speed', '冰层流动', 0.1, 1.2, 0.05, 0.35), range('intensity', '冰壁亮度', 0.2, 1.2, 0.05, 0.9), range('scale', '洞穴尺度', 0.6, 1.8, 0.05, 1.05)],
  'heart-health-dashboard': [range('speed', '心脏旋转', 0.1, 1.2, 0.05, 0.3), range('depth', '主体尺度', 0.3, 1.8, 0.05, 0.9)],
  'digital-persona': [range('speed', '人格脉冲', 0.1, 1.2, 0.05, 0.36), range('intensity', '扫描强度', 0.2, 1.2, 0.05, 0.92), range('scale', '体积尺度', 0.6, 1.8, 0.05, 1.08)],
  'cosmic-mapping': [range('speed', '星图流速', 0.1, 1.2, 0.05, 0.34), range('intensity', '揭示强度', 0.2, 1.2, 0.05, 0.9), range('scale', '地图尺度', 0.6, 1.8, 0.05, 1.05)],
  'future-machine': [range('speed', '机械转速', 0.1, 1.2, 0.05, 0.5), range('depth', '机构层级', 0.3, 1.8, 0.05, 1.2), range('pointerStrength', '视角跟随', 0, 0.8, 0.02, 0.26)],
  'mind-ai': [range('speed', '能量脉冲', 0.1, 1.2, 0.05, 0.42), range('intensity', '核心亮度', 0.2, 1.2, 0.05, 0.95), range('scale', '核心尺度', 0.6, 1.8, 0.05, 1.15)],
  'axle-journey': [range('speed', '轨迹流速', 0.1, 1.4, 0.05, 0.55), range('pointerStrength', '进度波动', 0, 1, 0.05, 0.3)],
  'bionova-biotech': [range('density', '细胞密度', 12, 96, 2, 48), range('speed', '细胞流速', 0.1, 1.4, 0.05, 0.48), range('pointerStrength', '细胞尺度差', 0, 1, 0.05, 0.45)]
}

const presentationById: Record<string, ScenePresentation> = {
  'digital-epoch': { styleGroup: 'Product Hero', interactionHint: '移动指针 · 观察 3D 产品视差' },
  'impressive-hero': { styleGroup: 'Editorial Hero', interactionHint: '移动指针 · 彩色锚点跟随' },
  'future-3d-portfolio': { styleGroup: '3D Portfolio', interactionHint: '移动指针 · 穿行项目空间' },
  'nival-cyberspace': { styleGroup: 'Cyber Portfolio', interactionHint: '移动指针 · 改变项目景深' },
  'cast-and-render': { styleGroup: '3D Object', interactionHint: '移动指针 · 检视雕塑材质' },
  alethia: { styleGroup: 'Glass 3D', interactionHint: '移动指针 · 改变玻璃视角' },
  'particle-field': { styleGroup: 'Particle Field', interactionHint: '移动指针 · 扰动粒子流场' },
  'react-vision': { styleGroup: 'Tech Network', interactionHint: '移动指针 · 吸附节点网络' },
  codeveil: { styleGroup: 'Developer Story', interactionHint: '滚动页面 · 推进工程流程' },
  consentinel: { styleGroup: 'Scroll Story', interactionHint: '滚动页面 · 切换扫描阶段' },
  'orbit-stickers': { styleGroup: 'Interactive Orbit', interactionHint: '拖动画面 · 改变贴纸轨道' },
  'liquid-glass-agency': { styleGroup: 'Liquid Glass', interactionHint: '移动指针 · 改变折射高光' },
  'playful-idea': { styleGroup: 'Creative Compare', interactionHint: '拖动分界 · 比较两个视觉版本' },
  'ancient-oath': { styleGroup: 'Editorial Morph', interactionHint: '移动指针 · 改变形体与放大镜' },
  'space-planet': { styleGroup: 'Space Hero', interactionHint: '移动指针 · 改变行星轨道视差' },
  'aetheris-voyage': { styleGroup: 'Cinematic Travel', interactionHint: '滚动页面 · 推进地平线与天体' },
  'frozen-cave': { styleGroup: 'Immersive Shader', interactionHint: '移动指针 · 用光源探索冰洞' },
  'heart-health-dashboard': { styleGroup: '3D Dashboard', interactionHint: '观察实时旋转 · 对照生命指标' },
  'digital-persona': { styleGroup: 'Raymarch Identity', interactionHint: '移动指针 · 扫描数字人格' },
  'cosmic-mapping': { styleGroup: 'Data Reveal', interactionHint: '移动指针 · 揭示隐藏星图' },
  'future-machine': { styleGroup: 'Robotics 3D', interactionHint: '移动指针 · 检视机械分层' },
  'mind-ai': { styleGroup: 'AI Shader', interactionHint: '移动指针 · 感受神经核心脉冲' },
  'axle-journey': { styleGroup: 'Operations Dashboard', interactionHint: '观察轨迹 · 读取实时任务状态' },
  'bionova-biotech': { styleGroup: 'Biotech SaaS', interactionHint: '观察细胞场 · 对照实验指标' }
}

export const getSceneParams = (sceneId: string, fallback: LabParam[]) =>
  sceneParamsById[sceneId]?.map((param) => ({ ...param })) ?? fallback.map((param) => ({ ...param }))

export const getScenePresentation = (sceneId: string): ScenePresentation =>
  presentationById[sceneId] ?? { styleGroup: 'Motion Scene', interactionHint: '与画面交互 · 查看动态反馈' }
