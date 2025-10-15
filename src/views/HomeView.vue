<script setup lang="ts">
import { useRouter } from 'vue-router';
import FlipCardIcon from '@/components/MjIcon/FlipCardIcon.vue';
import AnimationIcon from '@/components/MjIcon/AnimationIcon.vue';
import CssSpriteIcon from '@/components/MjIcon/CssSpriteIcon.vue';
import MarkdownIcon from '@/components/MjIcon/MarkdownIcon.vue';
import MineClearanceIcon from '@/components/MjIcon/MineClearanceIcon.vue';
import Merge2048Icon from '@/components/MjIcon/Merge2048Icon.vue';
import DrawCircleIcon from '@/components/MjIcon/DrawCircleIcon.vue';
import ETS2Icon from '@/components/MjIcon/ETS2Icon.vue';
import ChineseIcon from '@/components/MjIcon/ChineseIcon.vue';
import ColorIcon from '@/components/MjIcon/ColorIcon.vue';
import TextToImageIcon from '@/components/MjIcon/TextToImageIcon.vue';
import { ref } from 'vue';

const router = useRouter();
const navs = [
  {
    title: '工具',
    children: [
      {
        logo: AnimationIcon,
        link: '/animates',
        name: 'css动画',
      },
      {
        logo: CssSpriteIcon,
        link: '/tool/csssprite',
        name: 'css sprite',
      },
      {
        logo: MarkdownIcon,
        link: '/tool/markdown',
        name: 'markdown(未完善)',
      },
      {
        logo: ColorIcon,
        link: '/tool/color-generator',
        name: '颜色生成器',
      },
      {
        logo: TextToImageIcon,
        link: '/tool/image-generator',
        name: '文生图',
      },
    ],
  },
  {
    title: '游戏',
    children: [
      {
        logo: FlipCardIcon,
        link: '/game/flipcard',
        name: '翻转卡片',
      },
      {
        logo: MineClearanceIcon,
        link: '/game/mineclearance',
        name: '扫雷',
      },
      {
        logo: Merge2048Icon,
        link: '/game/2048',
        name: '2048',
      },
      {
        logo: DrawCircleIcon,
        link: '/game/drawcircle',
        name: '画圆',
      },
      {
        logo: ChineseIcon,
        link: '/game/chinese-combination',
        name: '汉字合成',
      },
      {
        logo: ChineseIcon,
        link: '/caiyan-baike',
        name: '猜盐-百科',
      },
      {
        logo: ChineseIcon,
        link: '/caiyan-geci',
        name: '猜盐-歌词',
      },
    ],
  },
  {
    title: 'ETS2',
    children: [
      {
        logo: ETS2Icon,
        link: '/ets2/jishaochengduo',
        name: '积少成多',
      },
    ],
  },
];
const jumpLink = (item: { link: string; name: string }) => {
  router.push(item.link);
};
const quickJumpRoute = ref('');
const jump = () => {
  router.push(quickJumpRoute.value);
};
</script>

<template>
  <main class="home">
    <div class="home-box">
      <div class="quick-jump">
        <input v-model="quickJumpRoute" @keypress.enter="jump" placeholder="快速跳转" />
      </div>
      <div class="nav-box" v-for="nav in navs" :key="nav.title">
        <dt class="nav-title" :id="nav.title">
          <span>{{ nav.title }}</span>
        </dt>
        <div class="nav-list">
          <dd
            class="nav-item"
            v-for="item in nav.children"
            :key="nav.title + '' + item.name"
            @click="jumpLink(item)"
          >
            <component :is="item.logo" />
            <span>{{ item.name }}</span>
          </dd>
        </div>
      </div>
    </div>
  </main>
</template>
<style lang="scss">
.home {
  background-color: #0f172a;
  min-height: 100vh;
  padding: 44px 0 80px;
  min-width: 960px;
  .home-box {
    width: 960px;
    margin: 0 auto;
    .quick-jump {
      text-align: right;
      input {
        height: 36px;
        border: 1px solid #ccc;
        background-color: #222;
        color: #ddd;
        outline: none;
        padding: 0 8px;
        border-radius: 4px;
      }
    }
    .nav-box {
      &:not(:last-child) {
        margin-bottom: 48px;
      }
      .nav-title {
        font-size: 36px;
        color: #cdcdcd;
        margin-bottom: 16px;
        span {
          display: inline-block;
          line-height: 56px;
          border-bottom: 4px solid #038466;
          position: relative;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            bottom: -4px;
            height: 4px;
            width: 0;
            background-color: #2ca88b;
            transition: all ease 0.3s;
          }
          &:hover::before {
            width: 100%;
          }
        }
      }
      .nav-list {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        .nav-item {
          margin-bottom: 4px;
          width: calc(25% - 12px);
          box-sizing: border-box;
          padding: 16px;
          background-color: #038466;
          border-radius: 8px;
          box-shadow: 0 0 4px 0 rgba($color: #000, $alpha: 0.3);
          color: #cdcdcd;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all ease 0.5s;
          line-height: 24px;
          font-weight: bold;
          &::before {
            position: absolute;
            left: -150%;
            top: -150%;
            content: '';
            width: 400%;
            height: 400%;
            background-color: #2ca88b;
            border-radius: 50%;
            z-index: 0;
            transform: scale(0);
            transform-origin: 50% 50%;
            transition: all ease 0.5s;
          }
          svg {
            width: 24px;
            z-index: 1;
          }
          span {
            z-index: 1;
          }
          &:hover {
            color: #fff;
            &::before {
              transform: scale(1);
            }
          }
        }

        @supports not (gap: 16px) {
          .nav-item {
            margin-bottom: 16px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .home {
    padding: 20px;
    min-width: auto;
    .home-box {
      width: 100%;
      .nav-box {
        .nav-list {
          .nav-item {
            width: calc(50% - 8px);
          }
        }
      }
    }
  }
}
@media screen and (max-width: 500px) {
  .home {
    .home-box {
      .nav-box {
        .nav-list {
          .nav-item {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
