<template>
    <div class="table">
        <h2>触发器配置信息:</h2>
        <el-button type="primary" icon="plus" class="handle-box2" @click="clickDialogSaveBtn">保存修改</el-button>
        <el-table :data="triggerList" border style="width: 100%" ref="multipleTable" v-loading="loading" @cell-dblclick="handleCellDbClick" @row-click="handleRowClick">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="dev_cn_name" label="设备名称" width="150"></el-table-column>
            <el-table-column prop="devunit_name" label="设备元名称"></el-table-column>
            <el-table-column prop="var_name" label="设备变量名称" width="120"></el-table-column>
            <el-table-column prop="if_symbol" label="符号" width="40"></el-table-column>
            <el-table-column prop="if_number" label="值" width="40"></el-table-column>
            <el-table-column prop="if_true_comment" label="判断正确输出"></el-table-column>
            <el-table-column prop="if_false_comment" label="判断错误输出"></el-table-column>
            <el-table-column prop="logs_type" label="日志类型">
                <template slot-scope="scope" >
                    <el-select size="small" v-model="scope.row.logs_type" @change="handleEdit(editColumnKey, scope.row)" v-if="editRowId==scope.row._id">
                        <el-option
                                v-for="item in prjLogList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                    <span v-else>{{ scope.row.logs_type }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
            <template slot-scope="scope">
                <el-button class="btn1" type="primary" size="small" @click="trigger_delete(scope.$index, scope.row._id)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @current-change ="handleCurrentChange"
                :current-page="currentPage"
                layout="prev, pager, next"
                :total="pageTotal">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    //import global_ from 'components/common/Global';
    let crypto = require('crypto');
    export default {
        data: function(){
            return {
                user_type:1,  //0:管理员, 1:用户
                user_account:'',
                radio3:'all',
                formLabelWidth: '120px',
                loading:false,
                fullscreenLoading: false,
                showDialogExport: false,

                editRowId:'-1',
                editColumnKey:'-1',
                listDataUpdate:[],
                prjLogList:["告警日志","运行日志","操作日志"],


                triggerList:[],
                dev_cn_name:'',
                devunit_name:'',

                pageTotal:1,
                currentPage:1,
                page_size:10,


                data_range: '',

            }
        },
        created: function(){
            //console.log('2222', this.$route.query);
            this.user_type = localStorage.getItem('user_type');  //管理员或用户
            this.user_account = localStorage.getItem('user_account');  //管理员或用户

            this.getRountPush;
            this.getTriggerListData(1, this.page_size);
        },
        beforeDestroy:function () {

        },
        methods: {
            getTriggerListData: function(current_page, page_size){//获取rom列表
                let self = this;
                let params = {
                    page_size: page_size,
                    current_page: current_page,
                    filter: {devunit_name: self.devunit_name}
                };
                self.loading = true;
                self.$axios.post('/api/trigger/page/list', params).then(function(res){
                    self.loading = false;
                    console.log('[ShowTriggerConfig] get trigger data, params:', params);
                    if(res.data.ret_code == 0){
                        self.triggerList = res.data.extra;
                        //self.pageTotal = res.data.total;
                    }else{
                        self.$message.error(res.data.ret_msg);
                    }

                });
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getTriggerListData(this.currentPage, this.page_size);
            },
            trigger_delete: function(index, _id){
                let self = this;
                let params = {_id: _id};
                self.loading = true;
                self.$axios.post('/api/trigger/del', params).then(function(res){
                    self.loading = false;
                    console.log('[ShowTriggerConfig] delete trigger data, index:', index);
                    if(res.data.ret_code == 0){
                        self.triggerList.splice(index, 1);
                        self.$message.success(res.data.ret_msg);
                    }else{
                        self.$message.error(res.data.ret_msg);
                    }
                });
            },
            clickDialogSaveBtn: function(){
                var self = this;
                var params = {
                    list_data:this.listDataUpdate
                };
                self.loading = true;
                self.$axios.post('api/trigger/update', params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        //self.$message({message:'修改成功',type:'success'});
                        self.$alert('保存成功，刷新页面', '标题', {
                            confirmButtonText: '确定',
                            callback: action => {
                                history.go(0);//刷新页面
                            }
                        });
                        //self.getDeviceList(self.currentPage, self.page_size);
                        self.listDataUpdate = [];
                        self.editRowId = '-1';
                        self.editColumnKey = '-1';
                    }else{
                        self.$message.error(res.data.ret_msg)
                    }

                },function(err){
                    self.$message.error('修改失败');
                    self.loading = false;
                    console.log(err);
                });

            },
            handleCellDbClick(row, column) {
                console.log('[ShowTriggerConfig] handleCellDbClick:', row[column.property], column.property);
                this.editRowId = row._id;
                this.editColumnKey = column.property;
            },
            handleRowClick(row, event, column) {
                console.log('[ShowTriggerConfig] handleRowClick', row[column.property], column.property);
                if (column.property != this.editColumnKey || row._id != this.editRowId) {
                    this.editRowId = '-1';
                    this.editColumnKey = '-1';
                }
            },
            handleEdit(key, row_data) {
                console.log('[ShowTriggerConfig] handleEdit:', row_data['_id'], key, row_data[key]);

                //console.log('this.listDataUpdate:', this.listDataUpdate);
                for (var i = 0; i< this.listDataUpdate.length; i++){
                    if (this.listDataUpdate[i]['_id'] == row_data['_id']){
                        this.listDataUpdate[i][key] = row_data[key];
                        console.log('ShowTriggerConfig[i]:', this.listDataUpdate[i]);
                        break;
                    }
                }

                //没有找到
                if (i >= this.listDataUpdate.length){
                    var updateObj = {};
                    updateObj['_id'] = row_data['_id'];
                    updateObj[key] = row_data[key];
                    this.listDataUpdate.push(updateObj);
                    console.log('new obj:', updateObj);
                }
                //self.listDataUpdate.push();
            },
        },
        computed:{
            getRountPush: function() {
                console.log('[ShowTriggerConfig] route push into device!');

                if (typeof(this.$route.params.devunit_name) === "undefined") {
                    this.devunit_name = localStorage.getItem('devunit_name');
                    console.log('devunit_name:', this.devunit_name);
                }
                else{
                    this.devunit_name = this.$route.params.devunit_name;
                    localStorage.setItem('devunit_name', this.devunit_name);
                }

                console.log('get $route.params:', this.$route.params);
                //因为在main.js中已经全局注册了store，所以这里直接用this.$直接使用。
                //return task_id;
            }
        }
    }
</script>

<style>
    .rad-group{margin-bottom:20px;}
    .orange{color:#eb9e05;background-color:inherit;}
    .title_box{margin-top:50px;}
    .btn_box{margin-top: 20px;margin-right: 50px;}
    .upload-demo .el-upload {cursor: pointer;position: relative;overflow: hidden;}
    .upload-demo .el-upload:hover {border-color: #409EFF;}
    .handle-box2{display:inline-block;float:right;}
</style>
