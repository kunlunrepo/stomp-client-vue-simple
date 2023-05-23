<template>
  <!--布局-->
  <a-layout>
    <!--头部-->
    <a-layout-header class="header">
      <div :style="{ color: 'white', width: '10rem', float: 'left' }">
        STOMP通信测试
      </div>
    </a-layout-header>
    <!--内容-->
    <a-layout>
      <!--左侧-->
      <a-layout-sider width="200" style="background: #fff">
        <!--菜单-->
        <a-menu
          v-model:selectedKeys="selectedKeys2"
          v-model:openKeys="openKeys"
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
          @click="hdlMenuClick"
        >
          <a-sub-menu key="sub1">
            <template #title>
              <span>
                <user-outlined />
                单频道交互
              </span>
            </template>
            <a-menu-item key="single-send-receipt"> 发送和接收 </a-menu-item>
            <a-menu-item key="single-receipt"> 接收 </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #title>
              <span>
                <user-outlined />
                多频道交互
              </span>
            </template>
            <a-menu-item key="multi-send-receipt"> 发送和接收 </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <!--右侧内容-->
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content
          :style="{
            margin: '24px 16px',
            padding: '24px',
            background: '#fff',
            minHeight: '280px',
          }"
        >
          <!--路由出口-->
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import { UserOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    UserOutlined,
  },
  setup() {
    const router = useRouter();

    // 处理菜单点击事件
    const hdlMenuClick = (itemData) => {
      console.log(itemData);
      if (itemData.key === "single-receipt") {
        console.log(router);
        router.push("/single-receipt");
      } else if (itemData.key === "single-send-receipt") {
        router.push("/single-send-receipt");
      } else if (itemData.key === "multi-send") {
        router.push("multi-send");
      } else if (itemData.key === "multi-send-receipt") {
        router.push("multi-send-receipt");
      }
    };

    return {
      selectedKeys2: ref(["1"]),
      openKeys: ref(["sub1"]),
      hdlMenuClick,
    };
  },
});
</script>

<style scoped></style>
