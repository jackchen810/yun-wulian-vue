<template>
  <div class="table" @contextmenu.prevent>
    <div class="handle-box rad-group" v-if="isShow">
      <el-button type="primary" icon="plus" class="handle-del mr10" @click="clickDialogBtn">添加设备</el-button>
      <!-- <el-button type="primary" icon="plus" class="handle-box2" @click="clickDialogSaveBtn">保存修改</el-button> -->
    </div>
    <el-table
      :data="deviceListData"
      border
      style="width: 100%"
      ref="multipleTable"
      v-loading="loading"
      @row-contextmenu="handRowleave"
      @row-click="handleRowClick"
    >
      <!-- <el-table :data="deviceListData" border style="width: 100%" ref="multipleTable" v-loading="loading"  @cell-dblclick="handleCellDbClick" @row-click="handleRowClick"> -->

      <el-table-column prop="dev_cn_name" label="设备名称" width="240">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.dev_cn_name" v-if="editRowId== scope.row._id"></el-input>
          <span v-else>{{ scope.row.dev_cn_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gateway_sn" label="设备标识" width="190">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.gateway_sn" v-if="editRowId== scope.row._id"></el-input>
          <span v-else>{{ scope.row.gateway_sn }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="devunit_name" label="设备字段" width="150">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.devunit_name" v-if="editRowId== scope.row._id"></el-input>
          <span v-else>{{ scope.row.devunit_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="project_name" label="所属项目" width="160">
        <template slot-scope="scope">
          <el-select size="small" v-model="scope.row.project_name" v-if="editRowId== scope.row._id">
            <el-option v-for="item in prjOwnerList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <span v-else>{{ scope.row.project_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gateway_vendor" label="网关厂商" width="160">
        <template slot-scope="scope">
          <el-select v-model="scope.row.gateway_vendor" v-if="editRowId==scope.row._id">
            <el-option v-for="item in vendorList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <!-- <el-input size="small" v-model="scope.row.gateway_vendor" 
          @change="handleEdit(editColumnKey, scope.row)" v-if="editRowId==scope.row._id"></el-input>-->
          <span v-else>{{ scope.row.gateway_vendor}}</span>
        </template>
      </el-table-column>
      <el-table-column   prop="device_status"  label="设备状态" width="90">
         <template slot-scope="scope">
           <span>{{ scope.row.device_status  == 'normal' ? '显示':'隐藏'}}</span>
        </template>
      
      </el-table-column>

      <el-table-column prop="update_time" label="创建时间" width="160"></el-table-column>
      <!--<el-table-column prop="device_image" label="设备图片" width="450"></el-table-column>-->
      <el-table-column prop="comment" label="备注说明">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.comment" v-if="editRowId==scope.row._id"></el-input>
          <span v-else>{{ scope.row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="isShow" width="160">
        <template slot-scope="scope">
          <el-button
            class="btn1"
            type="primary"
            size="small"
            @click="delDevice(scope.row._id,scope.row.dev_cn_name,scope.$index)"
          >删除</el-button>
          <el-button
            class="btn1"
            type="primary"
            size="small"
            @click="clickDialogSaveBtn(scope.row._id,scope.$index)"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="prev, pager, next"
        :total="pageTotal"
      ></el-pagination>
    </div>

    <el-dialog title="添加设备" :visible.sync="dialogFormVisible" class="digcont">
      <el-form :model="form" :rules="rules" ref="form">
        <!--
                <el-form-item label="上传" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            name="file_name"
                            with-credentials
                            :limit="1"
                            :action="uploadUrl"
                            :data="form"
                            :beforeUpload="beforeUpload"
                            :on-change="handleChange"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :file-list="fileList"
                            :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取设备图片</el-button>
                    </el-upload>
                </el-form-item>
        -->
        <el-form-item label="网关厂商" :label-width="formLabelWidth">
          <el-radio-group v-model="form.gateway_vendor">
            <el-radio v-for="item in vendorList" :key="item" :label="item" :value="item"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备中文名称" prop="dev_cn_name" :label-width="formLabelWidth">
          <el-input v-model="form.dev_cn_name" class="diainp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="网关标识" prop="gateway_sn" :label-width="formLabelWidth">
          <el-input v-model="form.gateway_sn" class="diainp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据库设备字段" prop="devunit_name" :label-width="formLabelWidth">
          <el-input v-model="form.devunit_name" class="diainp" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="设备所属项目" prop="project_name" :label-width="formLabelWidth">
          <el-select v-model="form.project_name" placeholder="请选择设备所属项目">
            <el-option v-for="item in prjOwnerList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注说明" prop="comment" :label-width="formLabelWidth">
          <el-input v-model="form.comment" class="diainp" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload(form)">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//import global_ from 'components/common/Global';
//var crypto = require('crypto');
export default {
  data: function () {
    return {
      user_type: 1, //0:管理员, 1:用户
      user_account: "",
      uploadUrl: "api/devunit/manage/add",
      isShow: localStorage.getItem("userMsg") == "1" ? false : true,
      dialogFormVisible: false,
      editRowId: "-1",
      editColumnKey: "-1",
      radio3: "全部",
      form: {
        gateway_sn: "",
        gateway_vendor: "",
        devunit_name: "",
        file_name: "",
        dev_cn_name: "",
        channel_name: "",
        project_name: "",
        device_image: "",
        comment: "",
      },
      rules: {
        gateway_sn: [
          { required: true, message: "请输入网关标识", trigger: "blur" },
        ],
        devunit_name: [
          {
            required: true,
            message: "请输入数据库中定义的设备字段",
            trigger: "blur",
          },
        ],
        dev_cn_name: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
        ],
        project_name: [
          { required: true, message: "请输入所属项目", trigger: "blur" },
        ],
      },
      formLabelWidth: "120px",
      fileList: [],
      loading: false,
      deviceListData: [],
      listDataUpdate: [],
      prjOwnerList: [],
      vendorList: {
        1: "爱德佳创",
        2: "物通博联",
        3: "金大万翔",
      },

      pageTotal: 2, //条总数
      currentPage: 1, //第一页
      page_size: 10,  // 每页10条
    };
  },
  created: function () {
    this.user_type = localStorage.getItem("user_type"); //管理员或用户
    this.user_account = localStorage.getItem("user_account"); //管理员或用户
    this.getDeviceList(this.currentPage, this.page_size);
    this.getProjectArray({ user_account: this.user_account });
  },
  methods: {
    getDeviceList: function (current_page, page_size) {
      //获取项目列表
      var self = this;
      var params = {
        page_size: page_size,
        current_page: current_page,
      };
      self.loading = true;
      self.$axios
        .post("/api/devunit/manage/page/list", params)
        .then(function (res) {
          self.loading = false;
          console.log(res);
          if (res.data.ret_code == 0) {
            self.deviceListData = res.data.extra;
            self.listDataUpdate = [];
            self.pageTotal = res.data.total;
            console.log( 'self.pageTotal'+ self.pageTotal)
          } else {
            self.deviceListData = [];
            self.listDataUpdate = [];
            self.$message.error(res.data.ret_msg);
          }
        });
    },
    getProjectArray: function (params) {
      //获取项目列表
      var self = this;
      self.loading = true;
      self.$axios
        .post("/api/project/manage/array", params)
        .then(function (res) {
          self.loading = false;
          if (res.data.ret_code == 0) {
            self.prjOwnerList = res.data.extra;
          } else {
            self.prjOwnerList = [];
            self.$message.error(res.data.ret_msg);
          }
        });
    },
    handleCurrentChange: function (val) {
      this.currentPage = val;
      this.getDeviceList(this.currentPage, this.page_size);
    },
    clickDialogBtn: function () {
      var self = this;
      self.form.dev_cn_name = "";
      this.dialogFormVisible = true;
    },
    clickDialogSaveBtn: function (id, index) {
      console.log(id + "=====" + index);
      var self = this;
      this.listDataUpdate[0] = this.deviceListData[index];
      console.log(this.listDataUpdate);
      var params = {
        list_data: this.listDataUpdate,
      };
      self.loading = true;
      self.$axios.post("api/devunit/manage/update", params).then(
        function (res) {
          self.loading = false;
          if (res.data.ret_code == 0) {
            //self.$message({message:'修改成功',type:'success'});
            self.$alert("保存成功，刷新页面", "修改", {
              confirmButtonText: "确定",
              callback: (action) => {
                // history.go(0);//刷新页面
                self.getDeviceList(1, 10);
              },
            });
            //self.getDeviceList(self.currentPage, self.page_size);
            self.listDataUpdate = [];
            self.editRowId = "-1";
            self.editColumnKey = "-1";
          } else {
            self.$message.error(res.data.ret_msg);
          }
        },
        function (err) {
          self.$message.error("修改失败");
          self.loading = false;
          console.log(err);
        }
      );
    },
    delDevice: function (id, fileName, i) {
      //删除
      var self = this;
      var params = {
        _id: id,
        dev_cn_name: fileName,
      };

      this.$confirm("确定要删除当前设备？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.$axios.post("api/devunit/manage/del", params).then(
            function (res) {
              self.loading = false;
              if (res.data.ret_code == 0) {
                self.$message({ message: "删除成功", type: "success" });
                // self.getDeviceList({});
                self.deviceListData.splice(i, 1);
              } else {
                self.$message.error(res.data.ret_msg);
              }
            },
            function (err) {
              self.$message.error("删除失败");
              self.loading = false;
              console.log(err);
            }
          );
        })
        .catch((action) => {});
    },
    submitUpload: function (stForm) {
      console.log("[devicemanage] submitUpload", stForm);
      var self = this;
      var params = {
        gateway_sn: stForm.gateway_sn,
        gateway_vendor: stForm.gateway_vendor,
        devunit_name: stForm.devunit_name,
        dev_cn_name: stForm.dev_cn_name,
        devunit_name: stForm.devunit_name,
        project_name: stForm.project_name,
        comment: stForm.comment,
      };
      self.loading = true;
      self.$axios.post("api/devunit/manage/add", params).then(
        function (res) {
          self.loading = false;
          if (res.data.ret_code == 0) {
            self.$message({ message: "添加成功", type: "success" });
            self.dialogFormVisible = false;
            // self.getDeviceList({});
            self.getDeviceList(1, 10);
            //self.deviceListData.splice(i,1);
          } else {
            self.$message.error(res.data.ret_msg);
          }
        },
        function (err) {
          self.$message.error("删除失败");
          self.loading = false;
          console.log(err);
        }
      );
    },
    beforeUpload: function (file) {
      console.log("[devicemanage] beforeUpload", file.name);
      //this.form.file_name = file.name;
      return true;
    },

    handleEdit(key, row_data) {
      console.log("handleEdit");
      console.log(
        "[devicemanage] handleEdit:",
        row_data["_id"],
        key,
        row_data[key]
      );
      console.log();
      //console.log('this.listDataUpdate:', this.listDataUpdate);
      for (var i = 0; i < this.listDataUpdate.length; i++) {
        if (this.listDataUpdate[i]["_id"] == row_data["_id"]) {
          this.listDataUpdate[i][key] = row_data[key];
          console.log("listDataUpdate[i]:", this.listDataUpdate[i]);
          break;
        }
      }
      //没有找到
      if (i >= this.listDataUpdate.length) {
        var updateObj = {};
        updateObj["_id"] = row_data["_id"];
        updateObj[key] = row_data[key];
        this.listDataUpdate.push(updateObj);
        console.log("new obj:", updateObj);
      }
      //self.listDataUpdate.push();
    },
    handleCellDbClick(row, column) {
      console.log(row);
      console.log(
        "[devicemanage] handleCellDbClick:",
        row[column.property],
        column.property
      );
      // this.editRowId = row._id;
      // this.editColumnKey = column.property;
    },
    handleRowClick(row, event, column) {
      console.log(column.property);
      this.editRowId = row._id;
      console.log(
        "[devicemanage] handleRowClick",
        row[column.property],
        column.property
      );
      // if (column.property != this.editColumnKey || row._id != this.editRowId) {
      //     this.editRowId = '-1';
      //     this.editColumnKey = '-1';
      // }
    },
    handRowleave(row, e) {
      //   e.preventDefault();
      console.log(e);
      this.editRowId = "";
      this.getDeviceList(1, 10);
    },
  },
  computed: {},
};
</script>

<style>
.rad-group {
  margin-bottom: 20px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.handle-box2 {
  display: inline-block;
  float: right;
}
.orange {
  color: #eb9e05;
  background-color: transparent;
}
.btn2 {
  margin-bottom: 5px;
  margin-left: 0;
}
.diainp {
  width: 217px;
}
.upload-demo .el-upload:hover {
  border-color: #409eff;
}
</style>
