<script setup>
import { useRoute } from 'vue-router'
import { useIsMobileStore } from '../../composables/isMobile.js'
import AppHeaderDesktop from './AppHeaderDesktop.vue'
import AppHeaderMobile from './AppHeaderMobile.vue'

const route = useRoute()
const isMobile = useIsMobileStore()
</script>

<template>
  <AppHeaderDesktop v-if="!isMobile.isMobile && route.name !== 'login'" />
  <AppHeaderMobile v-else-if="isMobile.isMobile && route.name !== 'login'" />
</template>
