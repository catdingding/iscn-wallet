<template>
  <div>
    <div class="search-block">
      <el-input v-model="address" placeholder="Please input a cosmos address" />
      <el-button type="primary" @click="address = $store.state.wallet.address">my address</el-button>
      <el-button type="primary" @click="search">search</el-button>
    </div>

    <el-table :data="iscn_records" style="width: 100%">
      <el-table-column prop="data.contentMetadata.@type" label="Type" width="100px" />
      <el-table-column prop="data.@id" label="ISCN ID" />
      <el-table-column label="Title / Name">
        <template #default="scope">
          {{ scope.row.data.contentMetadata.name || scope.row.data.contentMetadata.title }}
        </template>
      </el-table-column>
      <el-table-column prop="data.contentMetadata.keywords" label="Keywords" />
      <el-table-column prop="data.recordVersion" label="Version" width="80px" />
      <el-table-column label="URL" width="80px">
        <template #default="scope">
          <a target="_blank" :href="scope.row.data.contentMetadata.url" v-if="scope.row.data.contentMetadata.url">
            url
          </a>
        </template>
      </el-table-column>

      <el-table-column label="Created At" width="100px">
        <template #default="scope">
          {{ scope.row.data.recordTimestamp.slice(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column label="Detail">
        <template #default="scope">
          <el-button type="primary" @click="view_iscn_detail(scope.row)">View Detail</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="is_dialog_visible" title="ISCN Detail" width="75%">
      <ISCN :iscn_id="current_iscn_id" />
    </el-dialog>
  </div>
</template>
<script>
  import axios from "axios";
  import ISCN from "@/components/ISCN.vue";

  export default {
    data() {
      return { address: "", iscn_records: [], is_dialog_visible: false, current_iscn_id: "" };
    },
    methods: {
      async search() {
        this.iscn_records.length = 0;
        var res = await axios.get(`https://mainnet-node.like.co/iscn/records/owner?owner=${this.address}`);
        this.iscn_records.push(...res.data["records"]);
        this.$message({
          showClose: true,
          message: "Data fetched.",
          type: "success",
        });
      },
      view_iscn_detail(row) {
        this.current_iscn_id = row.data["@id"];
        this.is_dialog_visible = true;
      },
    },
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
