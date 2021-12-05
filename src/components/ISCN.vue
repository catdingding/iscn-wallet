<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="iscn_data">
      <el-tab-pane label="Display(simple)" name="first">
        <el-descriptions class="margin-top" :column="3" :size="size" border>
          <el-descriptions-item label="Type"> {{ iscn_data.data.contentMetadata["@type"] }} </el-descriptions-item>
          <el-descriptions-item label="ISCN ID"> {{ iscn_data.data["@id"] }} </el-descriptions-item>
          <el-descriptions-item label="Version"> {{ iscn_data.data.recordVersion }} </el-descriptions-item>
          <el-descriptions-item label="Owner"> {{ raw_data.owner }} </el-descriptions-item>

          <el-descriptions-item label="Title"> {{ iscn_data.data.contentMetadata.title }} </el-descriptions-item>
          <el-descriptions-item label="Name"> {{ iscn_data.data.contentMetadata.name }} </el-descriptions-item>
          <el-descriptions-item label="Content Fingerprints">
            <div v-for="id in iscn_data.data.contentFingerprints" :key="id">
              {{ id }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="Stakeholders">
            <div v-for="holder in iscn_data.data.stakeholders" :key="holder">
              {{ holder.entity.name }}
            </div>
          </el-descriptions-item>

          <el-descriptions-item label="Record Timestamp"> {{ iscn_data.data.recordTimestamp }} </el-descriptions-item>
          <el-descriptions-item label="URL">
            <a target="_blank" :href="iscn_data.data.contentMetadata.url" v-if="iscn_data.data.contentMetadata.url">
              url
            </a>
          </el-descriptions-item>
          <el-descriptions-item label="Abstract"> {{ iscn_data.data.contentMetadata.abstract }} </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="Display(raw)" name="second">
        <pre>{{ JSON.stringify(iscn_data, null, 2) }}</pre>
      </el-tab-pane>
      <el-tab-pane
        label="Transfer"
        name="fourth"
        :disabled="!$store.state.wallet || raw_data.owner != $store.state.wallet.address"
      >
        <el-input placeholder="Receiver address" v-model="receiver_address"></el-input>
        <el-button type="primary" @click="$store.dispatch('transfer_iscn', { iscn_id, receiver_address })">
          Transfer
        </el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import axios from "axios";
  export default {
    data() {
      return { raw_data: null, iscn_data: null, activeName: "first", receiver_address: "" };
    },
    props: { iscn_id: String },
    components: {},
    watch: {
      async iscn_id(new_iscn_id, old_iscn_id) {
        this.get_iscn_data(new_iscn_id);
      },
    },
    methods: {
      async get_iscn_data(iscn_id) {
        if (iscn_id) {
          var res = await axios.get(`https://mainnet-node.like.co/iscn/records/id?iscn_id=${iscn_id}`);
          this.raw_data = res.data;
          this.iscn_data = res.data.records[0];
        }
      },
    },
    async mounted() {
      this.get_iscn_data(this.iscn_id);
    },
  };
</script>

<style lang="less" scoped></style>
