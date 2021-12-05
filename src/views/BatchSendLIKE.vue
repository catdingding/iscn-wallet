<template>
  <div>
    <div>
      <el-switch
        v-model="is_using_likerid"
        active-color="#13ce66"
        inactive-color="#409eff"
        active-text="Liker ID Mode"
        inactive-text="Address Mode"
      >
      </el-switch>
    </div>
    Unit: LIKE
    <el-input type="textarea" :rows="10" :placeholder="placeholder" v-model="text"></el-input>
    <el-button type="primary" @click="submit"> Send LIKE </el-button>
  </div>
</template>
<script>
  import csv from "csvtojson";
  import axios from "axios";
  export default {
    data() {
      return {
        is_using_likerid: false,
        text: "",
        placeholder_address: `address,amount\ncosmos19xj7al674unvec7pzze64cq8efpknc4g5agzpx,9999`,
        placeholder_likerid: `likerid,amount\ncatding,9999`,
      };
    },
    computed: {
      placeholder() {
        return this.is_using_likerid ? this.placeholder_likerid : this.placeholder_address;
      },
    },
    methods: {
      async submit() {
        var payloads = await csv().fromString(this.text);
        if (this.is_using_likerid) {
          this.$message({
            message: `Processing Liker ID.`,
          });

          for (var payload of payloads) {
            try {
              var res = await axios.get(`https://api.like.co/users/id/${payload.likerid}/min`);
            } catch (e) {
              this.$message({
                message: `Liker ID ${payload.likerid} not found.`,
                type: "warning",
              });
              return;
            }
            payload.address = res.data.cosmosWallet;
            delete payload.likerid;
          }
        }

        await this.$store.dispatch("batch_send_like", { payloads });
      },
    },
    components: {},
  };
</script>

<style lang="less" scoped></style>
