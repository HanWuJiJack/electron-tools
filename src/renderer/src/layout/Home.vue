<template>
  <div class="home-main">
    <div class="topBar"></div>
    <div class="clearfix body">
      <div class="nav-left" :class="isCollapse ? 'fold-menu' : ''">
        <!-- 菜单 -->
        <el-menu default-active="/welcome" class="el-menu-vertical-demo" background-color="#001529" text-color="#fff"
          active-text-color="#409eff" router :collapse="isCollapse">
          <MenuTree :menuList="menuList" />
        </el-menu>
      </div>

      <div class="content-right" :class="isCollapse ? 'fold-content' : ''">
        <div class="top-bar">
          <!-- 面包屑 -->
          <div class="bar-left">
            <i class="collapse-i" @click="toggleMenue">
              <Expand v-show="isCollapse" />
              <Fold v-show="!isCollapse" />
            </i>
            <div class="bread">
              <Breadcrumb />
            </div>
          </div>
          <!-- 用户信息 -->
          <div class="top-userinfo">
          </div>
        </div>
        <!-- 路由显示区域 -->
        <div class="router-wrapper">
          <router-view></router-view>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import MenuTree from "./components/MenuTree.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import publicFn from "../utils/publicFn";
import _ from "lodash";
import { getApproveCount } from "@/api/syetem/approve";
import { getDictTypes } from "@/api/syetem/dictType";

export default {
  name: "Home",
  components: {
    MenuTree,
    Breadcrumb,
  },
  data() {
    return {
      isCollapse: false, // 菜单是否折叠
      userInfo: this.$store.state.userInfo, // 用户信息
      menuList: [], // 菜单列表数据
    };
  },
  mounted() {
    this.getMenuListRequest();
  },
  computed: {
    noticeCount() {
      return this.$store.state.noticeCount;
    },
  },
  methods: {
    //收缩菜单
    toggleMenue() {
      this.isCollapse = !this.isCollapse;
    },

    //获取菜单列表数据
    async getMenuListRequest() {
      // this.menuList = publicFn.genneratePath(_.cloneDeep(this.$store.state.menuList));
      this.menuList = this.$router.options.routes;
      // console.log("menuList", this.menuList)
    },
  },
};
</script>
<style lang="less">
.home-main {
  height: 100vh;
  position: relative;
  box-sizing: border-box;

  .topBar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    height: 40px;
    background-color: #000;
    // border: 1px solid red;
    -webkit-app-region: drag;
  }

  .body {
    padding-top: 40px;
    // margin-top: 40px;
    // height: calc(100vh - 40px);
    // overflow: hidden;
    position: relative;
  }

  .nav-left {
    position: fixed;
    top: 40px;
    width: 200px;
    height: calc(100vh - 40px);
    background-color: #001529;
    overflow-y: auto;
    transition: all 0.5s;

    .nav-left-logo {
      transition: all 1s;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      height: 50px;

      span {
        font-size: 16px;
        color: #fff;
      }

      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }

    .el-menu-item:hover {
      background-color: #0c2b42 !important;
    }

    .el-menu-vertical-demo {
      border: none;
    }

    &.fold-menu {
      width: 65px;
    }
  }

  .content-right {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-left: 200px;
    transition: all 0.5s;
    background-color: #eef0f3;
    min-height: calc(100vh - 40px);

    &.fold-content {
      margin-left: 65px;
    }

    .top-bar {
      box-sizing: border-box;
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      padding-left: 20px;
      padding-right: 50px;
      border-bottom: 1px solid #ddd;

      .bar-left {
        display: flex;
        align-items: center;

        .collapse-i {
          margin-right: 10px;
          font-size: 16px;
          width: 18px;
          line-height: 18px;
          cursor: pointer;
          color: #303133;
        }
      }

      .top-userinfo {
        display: flex;
        justify-content: center;
        align-items: center;

        .item {
          line-height: 30px;
          margin-top: 6px;
        }

        .bellicon {
          font-size: 20px;
          margin-right: 15px;
        }

        .userinfo-name {
          font-size: 18px;
          cursor: pointer;
          color: #409eff;
        }

        .el-badge__content.is-fixed.is-dot {
          right: 19px;
        }
      }
    }

    .router-wrapper {
      height: calc(100vh - 90px);
      box-sizing: border-box;
      padding: 10px;
      overflow: auto;
    }
  }
}
</style> 