import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import StaffManageView from '@/views/StaffManageView.vue'
import GoodsManageView from '@/views/GoodsManageView.vue'
import GoodsIndex from '@/components/goods/Index.vue'
import Edit from "../components/goods/Edit.vue";

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
      component: GoodsManageView,
      children: [
        {
          path: '',
          name: 'goods-index',
          component: GoodsIndex
        },
        {
          path: 'edit/:name',
          name: 'goods-edit',
          component: Edit
        }
      ]
    }
  ],
})

export default router
