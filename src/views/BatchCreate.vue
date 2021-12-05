<template>
  <div>
    <div>Add "iscn_id" field if you want to update exists ISCN record(s)</div>
    <el-input type="textarea" :rows="10" :placeholder="placeholder" v-model="text"></el-input>
    <el-button type="primary" @click="submit"> Create / Update ISCN </el-button>
  </div>
</template>
<script>
  import csv from "csvtojson";
  export default {
    data() {
      return {
        text: "",
        placeholder: `title,author,keywords,contentFingerprints\nhello,catding,"key1,key2","ipfs://xxxx,ar://xxxx"`,
      };
    },
    methods: {
      async submit() {
        var payloads = await csv().fromString(this.text);
        for (var payload of payloads) {
          if (payload.keywords) {
            payload.keywords = payload.keywords.split(",");
          }
          if (payload.contentFingerprints) {
            payload.contentFingerprints = payload.contentFingerprints.split(",");
          }
        }
        if (payloads[0]["iscn_id"]) {
          await this.$store.dispatch("batch_add_iscn", { payloads, mode: "update" });
        } else {
          for (const payload of payloads) {
            await this.$store.dispatch("batch_add_iscn", { payloads: [payload], mode: "create" });
            console.log(1);
          }
        }
      },
    },
    components: {},
  };
</script>

<style lang="less" scoped></style>
