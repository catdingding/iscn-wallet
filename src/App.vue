<template>
  <div id="app">
    <el-container>
      <el-aside>
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
          <el-menu-item index="create" :route="{ path: '/create' }">Create/Update ISCN</el-menu-item>
          <el-menu-item index="batch-create" :route="{ path: '/batch-create' }">Batch Create/Update</el-menu-item>
          <el-menu-item index="list" :route="{ path: '/list' }">List ISCN By Owner</el-menu-item>
          <el-menu-item index="find" :route="{ path: '/find' }">Find ISCN By ID</el-menu-item>
          <el-menu-item index="batch-send-like" :route="{ path: '/batch-send-like' }">Batch Send LIKE</el-menu-item>
        </el-menu>
        <div class="connect-wallet">
          <el-button type="primary" @click="$store.dispatch('connect_wallet')">
            {{ $store.state.wallet ? $store.state.wallet.address.slice(0, 12) + "…" : "Connect Keplr Wallet" }}
          </el-button>
        </div>
      </el-aside>
      <el-container>
        <el-main><router-view class="router-view" /></el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="less">
  #app {
    min-height: 100vh;
  }
  .el-aside {
    background-color: #9398a0;
    padding: 0px;
  }

  .el-main {
    min-height: 100vh;
  }
  .router-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 25px 0 25px 0;
    display: flex;
    justify-content: space-around;
    flex-flow: row wrap;
  }
  .connect-wallet {
    text-align: center;
    padding: 20px;
  }
  body {
    margin: 0;
  }
</style>
