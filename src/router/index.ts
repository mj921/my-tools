import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/animates',
      redirect: '/animates/basic',
    },
    {
      path: '/animates',
      name: 'animates',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Animates/AnimatesView.vue'),
      children: [
        {
          path: '/animates/:group',
          name: 'animates-group',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/Animates/AnimatesView.vue'),
          children: [
            {
              path: '/animates/:group/:type',
              name: 'animates-type',
              // route level code-splitting
              // this generates a separate chunk (About.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import('../views/Animates/AnimatesView.vue'),
              children: [
                {
                  path: '/animates/:group/:type/:subtype',
                  name: 'animates-subtype',
                  // route level code-splitting
                  // this generates a separate chunk (About.[hash].js) for this route
                  // which is lazy-loaded when the route is visited.
                  component: () => import('../views/Animates/AnimatesView.vue'),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/rankfight',
      name: 'rankfight',
      component: () => import('../views/RankFightView.vue'),
    },
    {
      path: '/game/zhongzu',
      name: 'game-zhongzu',
      component: () => import('../views/Games/ZhongZu/ZhongZuView.vue'),
    },
    {
      path: '/chaodai',
      name: 'chaodai',
      component: () => import('../views/ChaoDai/ChaoDaiView.vue'),
    },
    {
      path: '/game/flipcard',
      name: 'game-flipcard',
      component: () => import('../views/Games/FlipCard/FlipCardView.vue'),
    },
    {
      path: '/game/mineclearance',
      name: 'game-mineclearance',
      component: () => import('../views/Games/MineClearance/MineClearance.vue'),
    },
    {
      path: '/tool/csssprite',
      name: 'tool-csssprite',
      component: () => import('../views/Tools/CssSprite/CssSprite.vue'),
    },
    {
      path: '/tool/borderradius',
      name: 'tool-borderradius',
      component: () => import('../views/Tools/CustomBorderRadius/CustomBorderRadius.vue'),
    },
    {
      path: '/tool/markdown',
      name: 'tool-markdown',
      component: () => import('../views/Tools/MarkDown/MarkDown.vue'),
    },
  ],
});

export default router;
