<template>
  <template v-for="item in menuList" :key="item.meta.key">
    <el-sub-menu :index="item.path" v-if="item.children &&
      item.children.length > 0 &&
      item.meta.menu == true &&
      item.meta.hide == false
      ">
      <template #title>
        <el-icon :size="16" color="#333">
          <component v-bind:is="item.icon"></component>
        </el-icon>
        <i :class="item.icon"></i>
        <span>{{ item.meta.name }}</span>
      </template>
      <!-- 递归组件，再次循环判断子菜单 -->
      <MenuTree :menuList="item.children" />
    </el-sub-menu>
    <el-menu-item v-if="item.meta.menu == false && item.meta.hide == false" :index="item.path">
      <el-icon :size="16" color="#333">
        <component v-bind:is="item.icon"></component>
      </el-icon>
      <template #title>{{ item.meta.name }}</template>
    </el-menu-item>
    <!-- <MenuTree :menuList="item.children" /> -->
  </template>
</template>
<script>
export default {
  name: "MenuTree",
  props: {
    menuList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
};
</script>