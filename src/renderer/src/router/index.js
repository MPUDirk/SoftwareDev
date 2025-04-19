import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import StaffManageView from '@/views/StaffManageView.vue'
import GoodsManageView from '@/views/GoodsManageView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/staff',
      name: 'staff',
      component: StaffManageView,
    },
    {
      path: '/goods',
      name: 'goods',
      component: GoodsManageView,
    }
  ],
})

export default router
