<template>
    <div>
        <div>
            <el-input size="small" class="input_type" placeholder="添加名称..."
                      prefix-icon="el-icon-plus" @keydown.enter.native="addJoblevel" v-model="job.name">
            </el-input>
            <el-input size="small" class="input_type" placeholder="添加职称..."
                      prefix-icon="el-icon-plus" @keydown.enter.native="addJoblevel" v-model="job.titleLevel">
            </el-input>
            <br>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addJoblevel">
                添加
            </el-button>
            <el-table :data="jobs" stripe border type="small" style="width: 70%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="56"></el-table-column>
                <el-table-column prop="id" label="编号" width="56"></el-table-column>
                <el-table-column prop="name" label="名称" width="180"></el-table-column>
                <el-table-column prop="titleLevel" label="职称" width="180"></el-table-column>
                <el-table-column prop="createdate" label="创建时间" width="250"></el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="danger" size="small" style="margin-top: 8px" @click="deleteMany"
                       :disabled="multipleSelection.length === 0">
                批量删除
            </el-button>
        </div>
        <el-dialog title="修改职称和名称" :visible.sync="dialogVisible" width="30%">
            <div>
                <el-tag>职位名称</el-tag>
                <el-input class="update_input" size="small" v-model="updateJob.name"></el-input>
                <br>
                <el-tag>名称</el-tag>
                <el-input class="update_input" size="small" v-model="updateJob.titleLevel"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doUpdate" size="small">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'JobLevel',
        data() {
            return {
                job: {
                    name: '',
                    titleLevel:''
                },
                jobs: [],
                updateJob: {
                    name: '',
                    titleLevel:''
                },
                dialogVisible: false,
                multipleSelection: []
            }
        },
        methods: {
            async initJobLevels () {

                const data = await this.getRequest('/system/basic/job/')
                if (data) {
                    console.log(data)
                    this.jobs = data.obj
                }
            },
            async addJoblevel () {
                if (this.job.name && this.job.titleLevel) {
                    const resp = await this.postRequest('/system/basic/job/', this.job)
                    if (resp) {
                        this.initJobLevels()
                        this.job.titleLevel=''
                        this.job.name = ''
                    }
                } else {
                    this.$message.error('职位名称或名称不能为空')
                }
            },

            showEditDialog (index, data) {
                // this.updatePos = data
                Object.assign(this.updateJob, data)
                this.dialogVisible = true
            },
            async doUpdate() {
                const resp = await this.putRequest('/system/basic/job/', this.updateJob)
                if (resp) {
                    this.initJobLevels()
                    this.updateJob.name = ''
                    this.updateJob.titleLevel=''
                    this.dialogVisible = false
                }
            },
            handleDelete (index, data) {
                this.$confirm('此操作将永久删除' + data.name + '职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/job/' + data.id).then(resp => {
                        this.initJobLevels()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            handleSelectionChange(val) {
                console.log(val)
                this.multipleSelection = val
            },
            deleteMany() {
                this.$confirm('此操作将永久删除' + this.multipleSelection.length + '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = "?"
                    this.multipleSelection.forEach(item => {
                        ids += "ids=" + item.id + '&'
                    })
                    this.deleteRequest('/system/basic/job/' + ids).then(resp => {
                        this.initJobLevels()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            }
        },
        mounted () {
            this.initJobLevels()
        }
    }
</script>

<style scoped>
    .input_type {
        width: 300px;
        margin-right: 8px;
        margin-bottom: 16px;
    }
    .update_input {
        width: 200px;
        margin-left: 8px;
    }
</style>