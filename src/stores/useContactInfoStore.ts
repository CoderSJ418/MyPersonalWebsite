import { defineStore } from 'pinia'
import contactInfoData from '@/assets/data/contact-info.json'
import personalInfoData from '@/assets/data/personal-info.json'

export interface ContactInfo {
  name: string
  email: string
  phone: string
  location: string
  social: {
    github: string
    linkedin: string
    twitter: string
    email: string
  }
  availability: string
  responseTime: string
}

export interface PersonalInfo {
  name: string
  title: string
  avatar: string
  bio: string
  location: string
  email: string
  phone: string
  website: string
  github: string
  linkedin: string
  twitter: string
  yearsOfExperience: number
  languages: string[]
  interests: string[]
}

export const useContactInfoStore = defineStore('contactInfo', () => {
  const contact = ref<ContactInfo>(contactInfoData)
  const personal = ref<PersonalInfo>(personalInfoData)

  return {
    contact,
    personal
  }
})
