<template>
  <div>
    <div class="search-block">
      <el-input v-model="iscn_id" placeholder="Please input an ISCN ID" />
    </div>
    <ISCN :iscn_id="iscn_id" style="width: 100%" />
  </div>
</template>
<script>
  import ISCN from "@/components/ISCN.vue";

  export default {
    data() {
      return { iscn_id: "" };
    },
    methods: {},
    components: { ISCN },
  };
</script>

<style lang="less" scoped>
  .search-block {
    width: 100%;
    .el-input {
      width: calc(100% - 250px);
    }
  }
</style>
