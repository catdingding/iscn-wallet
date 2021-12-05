<template>
  <div>
    <el-switch
      v-model="is_update"
      active-color="#13ce66"
      inactive-color="#409eff"
      active-text="Update ISCN"
      inactive-text="Create ISCN"
    >
    </el-switch>
    <div class="iscn-id" v-show="is_update">
      ISCN ID
      <el-input v-model="iscn_id"></el-input>
    </div>

    <div v-for="(row, index) in fields" :key="index" class="field-block">
      <el-input v-model="row.name"></el-input>
      <el-input v-model="row.value" :placeholder="row.placeholder"></el-input>
      <el-button type="danger" @click="fields.splice(index, 1)">Remove</el-button>
    </div>
    <el-button type="success" @click="fields.push({ name: 'field_name', value: '' })">Add Field</el-button>
    <el-button type="danger" @click="reset_form">Reset Form</el-button>
    <el-button type="primary" @click="submit"> Create / Update ISCN </el-button>
  </div>
</template>
<script>
  export default {
    data() {
      return { fields: [], iscn_id: "", is_update: false };
    },
    methods: {
      reset_form() {
        this.fields = [
          { name: "type", value: "" },
          { name: "title", value: "" },
          { name: "author", value: "" },
          { name: "description", value: "" },
          { name: "url", value: "" },
          { name: "keywords", value: "", placeholder: "keyword1,keyword2,……" },
          { name: "contentFingerprints", value: "", placeholder: "ipfs://xxxxxx,ar://xxxxxx……" },
          { name: "usageInfo", value: "" },
        ];
        this.iscn_id = "";
      },
      async submit() {
        var payload = {};
        for (const field of this.fields) {
          if (field.name === "keywords" || field.name === "contentFingerprints") {
            payload[field.name] = field.value.split(",");
          } else {
            payload[field.name] = field.value;
          }
        }
        if (this.is_update) {
          await this.$store.dispatch("batch_add_iscn", {
            payloads: [{ iscn_id: this.iscn_id, ...payload }],
            mode: "update",
          });
        } else {
          await this.$store.dispatch("batch_add_iscn", { payloads: [payload], mode: "create" });
        }
      },
    },
    mounted() {
      this.reset_form();
    },
    components: {},
  };
</script>

<style lang="less" scoped>
  .iscn-id {
    width: 100%;
    .el-input {
      width: 70%;
    }
  }
  .field-block {
    width: 100%;
    .el-input:nth-child(1) {
      width: 20%;
    }
    .el-input:nth-child(2) {
      width: 60%;
    }
    .el-input {
      margin: 5px;
    }
  }
</style>
