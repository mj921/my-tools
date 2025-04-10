import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: '大杂烩',
      },
      component: HomeView,
    },
    {
      path: '/animates',
      redirect: '/animates/basic',
    },
    {
      path: '/animates',
      name: 'animates',
      meta: {
        title: '动画',
      },
      component: () => import('../views/Animates/AnimatesView.vue'),
      children: [
        {
          path: '/animates/:group',
          name: 'animates-group',
          component: () => import('../views/Animates/AnimatesView.vue'),
          children: [
            {
              path: '/animates/:group/:type',
              name: 'animates-type',
              component: () => import('../views/Animates/AnimatesView.vue'),
              children: [
                {
                  path: '/animates/:group/:type/:subtype',
                  name: 'animates-subtype',
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
      path: '/componentdemo',
      name: 'componentdemo',
      component: () => import('../views/ComponentDemo.vue'),
    },
    {
      path: '/example/day',
      name: 'example-day',
      component: () => import('../views/ComponentExample/DayExample.vue'),
    },
    {
      path: '/example/pre',
      name: 'example-pre',
      component: () => import('../views/ComponentExample/PreExample.vue'),
    },
    {
      path: '/example/pie',
      name: 'example-pie',
      component: () => import('../views/ComponentExample/PieExample.vue'),
    },
    {
      path: '/example/shape',
      name: 'example-shape',
      component: () => import('../views/ComponentExample/ShapeExample.vue'),
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
      meta: {
        title: '翻转卡片',
      },
      component: () => import('../views/Games/FlipCard/FlipCardView.vue'),
    },
    {
      path: '/game/mineclearance',
      name: 'game-mineclearance',
      meta: {
        title: '扫雷',
      },
      component: () => import('../views/Games/MineClearance/MineClearance.vue'),
    },
    {
      path: '/tool/csssprite',
      name: 'tool-csssprite',
      meta: {
        title: 'css雪碧图',
      },
      component: () => import('../views/Tools/CssSprite/CssSprite.vue'),
    },
    {
      path: '/tool/borderradius',
      name: 'tool-borderradius',
      meta: {
        title: '圆角',
      },
      component: () => import('../views/Tools/CustomBorderRadius/CustomBorderRadius.vue'),
    },
    {
      path: '/tool/markdown',
      name: 'tool-markdown',
      meta: {
        title: 'markdown',
      },
      component: () => import('../views/Tools/MarkDown/MarkDown.vue'),
    },
    {
      path: '/tool/filebrower',
      name: 'tool-filebrower',
      meta: {
        title: '文件浏览',
      },
      component: () => import('../views/Tools/FileBrower/FileBrower.vue'),
    },
    {
      path: '/tool/perviewbase64',
      name: 'tool-perviewbase64',
      component: () => import('../views/Tools/FileBrower/PerviewBase64.vue'),
    },
    {
      path: '/game/2048',
      name: 'game-2048',
      meta: {
        title: '2048',
      },
      component: () => import('../views/Games/2048/Merge2048.vue'),
    },
    {
      path: '/game/trucksimulation',
      name: 'game-trucksimulation',
      component: () => import('../views/Games/TruckSimulation/TruckSimulation.vue'),
    },
    {
      path: '/game/drawcircle',
      name: 'game-drawcircle',
      meta: {
        title: '画圆挑战',
      },
      component: () => import('../views/Games/DrawCircle/DrawCircle.vue'),
    },
    {
      path: '/tool/apitest',
      name: 'tool-apitest',
      component: () => import('../views/Tools/ApiTest/ApiTest.vue'),
    },
    {
      path: '/ets2/jishaochengduo',
      name: 'ets2-jishaochengduo',
      meta: {
        title: 'ETS2-成就-积少成多',
      },
      component: () => import('../views/ETS2/JiShaoChengDuo/JiShaoChengDuo.vue'),
    },
    {
      path: '/test/postmessage',
      name: 'test-postmessage',
      meta: {
        title: 'postmessage',
      },
      component: () => import('../views/Test/PostMessage/PostMessage.vue'),
    },
    {
      path: '/test/sun',
      name: 'test-sun',
      meta: {
        title: 'sun',
      },
      component: () => import('../views/Test/SunView.vue'),
    },
    {
      path: '/game/flight-chess',
      name: 'game-flight-chess',
      meta: {
        title: '飞行棋',
      },
      component: () => import('../views/Games/FlightChess/FlightChessView.vue'),
    },
    {
      path: '/game/chinese-combination',
      name: 'game-chinese-combination',
      meta: {
        title: '汉字合成',
      },
      component: () => import('../views/Games/ChineseCombination/ChineseCombination.vue'),
    },

    {
      path: '/tool/color-generator',
      name: 'tool-color-generator',
      meta: {
        title: '颜色生成器',
      },
      component: () => import('../views/Tools/ColorGenerator/ColorGenerator.vue'),
    },
    {
      path: '/dsp/blueprint',
      name: 'dsp-blueprint',
      meta: {
        title: '戴森球计划-蓝图',
      },
      component: () => import('../views/DSP/Blueprint/BlueprintView.vue'),
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import('../views/Booking/BookingView.vue'),
      meta: {
        title: '年夜饭预定',
      },
      redirect: '/booking/home',
      children: [
        {
          path: '/booking/home',
          name: 'booking-home',
          component: () => import('../views/Booking/BookingHomeView.vue'),
          meta: {
            title: '年夜饭预定-日历',
          },
        },
        {
          path: '/booking/detail/:date',
          name: 'booking-detail',
          component: () => import('../views/Booking/BookingDetailView.vue'),
          meta: {
            title: '年夜饭预定-详情',
          },
        },
        {
          path: '/booking/add/:date/:id',
          name: 'booking-edit',
          component: () => import('../views/Booking/BookingAddView.vue'),
          meta: {
            title: '年夜饭预定-修改',
          },
        },
        {
          path: '/booking/add/:date',
          name: 'booking-add',
          component: () => import('../views/Booking/BookingAddView.vue'),
          meta: {
            title: '年夜饭预定-新增',
          },
        },
      ],
    },
  ],
});

export default router;
