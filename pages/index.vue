<template>
  <div>
    <AppHero />
    <div class="max-w-6xl mx-auto px-4 py-8">

      <!-- Campaigns Content -->
      <div v-if="data">

        <!-- Ongoing Campaigns -->
        <div v-if="data.body.length > 0" class="mb-12">

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="campaign in data.body" :key="campaign.id"
              class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200"
              @click="viewCampaignExams(campaign.id)">

              <!-- Campaign Card Header with Background -->
              <div class="relative h-48 bg-gradient-to-br from-amber-200 via-orange-300 to-red-400 overflow-hidden">
                <!-- Spiral Background Pattern -->
                <div class="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 200 200" class="w-full h-full">
                    <defs>
                      <radialGradient id="spiralGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0.3" />
                      </radialGradient>
                    </defs>
                    <path d="M100 20 Q150 50 120 100 Q70 150 100 120 Q130 70 100 100 Q90 110 100 100"
                      fill="url(#spiralGradient)" stroke="#f59e0b" stroke-width="2" fill-opacity="0.6" />
                  </svg>
                </div>

                <!-- Floating Elements -->
                <div
                  class="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <div class="w-4 h-4 bg-white bg-opacity-60 rounded-full"></div>
                </div>

                <!-- Campaign Status Badge -->
                <div class="absolute top-4 left-4">
                  <span class="bg-white bg-opacity-90 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                    চলমান
                  </span>
                </div>
              </div>

              <!-- Campaign Content -->
              <div class="p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {{ campaign.title }}
                </h2>

                <p class="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {{ campaign.description }}
                </p>

                <!-- Campaign Stats -->
                <div class="flex items-center text-sm text-gray-600 gap-2 pt-3 border-t border-gray-100">
                  <span class="font-medium">{{ campaign.total_exam }}টি পরীক্ষা</span>
                  <DotIcon class="w-3 h-3 text-gray-400" />
                  <span>{{ calculateDaysLeft(campaign.start_time, campaign.end_time) }} দিন</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Campaigns Message -->
        <div v-if="data.body.length === 0" class="text-center py-16">
          <Icon name="lucide:calendar-x" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-gray-900 mb-4">No Campaigns Available</h2>
          <p class="text-gray-600 mb-6">
            There are currently no campaigns available for your level ({{ user.level }}).
          </p>
          <Button @click="refresh()" variant="outline">
            <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
            Check Again
          </Button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { DotIcon } from 'lucide-vue-next'

// Define page meta
definePageMeta({
  title: 'Free Exam Platform - Home',
  description: 'Access free exams and campaigns based on your level',
  middleware: ['protected']
})

// Get authenticated user
const user = useUser()

// Fetch campaigns data only if user is authenticated
const { data, status, error, refresh } = await useFetch('/api/campaigns', {
  key: 'user-campaigns',
  server: false, // Only run on client since it requires authentication
})



const viewCampaignExams = (campaignId) => {
  navigateTo(`/exam?campaign=${campaignId}`)
}

const calculateDaysLeft = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Watch user state and refresh data when user logs in
watch(user, (newUser) => {
  if (newUser && (!data.value)) {
    refresh()
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>