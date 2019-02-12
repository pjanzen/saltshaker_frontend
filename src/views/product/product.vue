<template>
    <div>
        <common-table
                :cColumns="cColumns"
                :apiService="apiService"
                @getProductEvent="getProductEvent"
                :productShow="false"
                ref="childrenMethods">
            <Button slot="create" type="primary" @click="add('formValidate')">Create product</Button>
            <Modal slot="option" v-model="formView"  :title="optionTypeName">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="125">
                    <FormItem label="Product line name" prop="name">
                        <Input v-model="formValidate.name" placeholder="Enter your user name"></Input>
                    </FormItem>
                    <FormItem label="description" prop="description">
                        <Input v-model="formValidate.description" placeholder="Input description"></Input>
                    </FormItem>
                    <FormItem label="Master ID" prop="salt_master_id">
                        <Input v-model="formValidate.salt_master_id" placeholder="Enter Master ID"></Input>
                    </FormItem>
                    <FormItem label="Master API address" prop="salt_master_url">
                        <Input v-model="formValidate.salt_master_url" placeholder="Enter the Master API address"></Input>
                    </FormItem>
                    <FormItem label="Master API username" prop="salt_master_user">
                        <Input v-model="formValidate.salt_master_user" placeholder="Enter the Master API username"></Input>
                    </FormItem>
                    <FormItem label="Master API password" prop="salt_master_password">
                        <Input v-model="formValidate.salt_master_password" placeholder="Enter the Master API password"></Input>
                    </FormItem>
                    <FormItem label="file server">
                        <RadioGroup v-model="formValidate.file_server">
                            <Radio label="gitfs">GitLab</Radio>
                            <Radio label="rsync">Rsync</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem v-if="this.formValidate.file_server === 'gitfs'" label="GitLab address" prop="gitlab_url">
                        <Input v-model="formValidate.gitlab_url" placeholder="Enter the GitLab address"></Input>
                    </FormItem>
                    <FormItem v-if="this.formValidate.file_server === 'gitfs'" label="GitLab API version" prop="api_version">
                        <Input v-model="formValidate.api_version" placeholder="Enter the GitLab API version"></Input>
                    </FormItem>
                    <FormItem v-if="this.formValidate.file_server === 'gitfs'" label="GitLab Token" prop="private_token">
                        <Input v-model="formValidate.private_token" placeholder="Enter GitLab Token"></Input>
                    </FormItem>
                    <FormItem v-if="this.formValidate.file_server === 'gitfs'" label="GitLab State project" prop="state_project">
                        <Input v-model="formValidate.state_project" placeholder="Enter the GitLab State project"></Input>
                    </FormItem>
                    <FormItem v-if="this.formValidate.file_server === 'gitfs'" label="GitLab Pillar project" prop="pillar_project">
                        <Input v-model="formValidate.pillar_project" placeholder="Enter the GitLab Pillar project"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
                    <Button type="primary" @click="handleSubmit('formValidate')">submit</Button>
                </div>
            </Modal>
        </common-table>
    </div>
</template>

<script>
    import CommonTable from '../common-components/table/table.vue';
    export default {
        components: {
            CommonTable
        },
        data () {
            return {
                apiService: 'product',
                productData: [],
                productId: '',
                // 删除数据
                delId: '',
                delIndex: '',
                // 编辑数据
                formView: false,
                id: '',
                optionType: '',
                optionTypeName: '',
                cColumns: [
                    {
                        title: 'product line',
                        key: 'name',
                        sortable: true,
                        width: 160,
                        fixed: 'left',
                        render: (h, params) => {
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: params.row.id,
                                        transfer: true,
                                        placement: 'top-start'
                                    }
                                }, params.row.name)
                            ]);
                        }
                    },
                    {
                        title: 'description',
                        key: 'description',
                        width: 160,
                        sortable: true
                    },
                    {
                        title: 'Master ID',
                        key: 'salt_master_id',
                        width: 160,
                        sortable: true
                    },
                    {
                        title: 'Master API url',
                        key: 'salt_master_url',
                        width: 180,
                        sortable: true
                    },
                    {
                        title: 'Master API username',
                        key: 'salt_master_user',
                        width: 160,
                        sortable: true
                    },
                    {
                        title: 'file server',
                        key: 'file_server',
                        width: 140,
                        sortable: true
                    },
                    {
                        title: 'GitLab url',
                        key: 'gitlab_url',
                        width: 180,
                        sortable: true
                    },
                    {
                        title: 'GitLab API version',
                        key: 'api_version',
                        width: 160,
                        sortable: true
                    },
                    {
                        title: 'GitLab Token',
                        key: 'private_token',
                        width: 160,
                        sortable: true
                    },
                    {
                        title: 'GitLab State project',
                        key: 'state_project',
                        width: 160,
                        sortable: true
                    },
                    {
                        title: 'GitLab Pillar project',
                        key: 'pillar_project',
                        width: 160,
                        sortable: true
                    },
                    {
                        title: 'action',
                        key: 'action',
                        width: 123,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.formView = true;
                                            this.optionType = 'edit';
                                            this.optionTypeName = '编辑';
                                            this.id = params.row.id;
                                            this.formValidate = params.row;
                                        }
                                    }
                                }, 'edit'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: 'Make sure you want to delete ' + params.row.name + ' ?',
                                        transfer: true,
                                        placement: 'top-end'
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.delId = params.row.id;
                                            this.delIndex = params.index;
                                            this.del();
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        }
                                    }, 'delete')
                                ])
                            ]);
                        }
                    }
                ],
                // 表单验证
                formValidate: {
                    name: '',
                    description: '',
                    salt_master_id: '',
                    salt_master_url: '',
                    salt_master_user: '',
                    salt_master_password: '',
                    file_server: 'gitfs',
                    gitlab_url: '',
                    api_version: '',
                    private_token: '',
                    state_project: '',
                    pillar_project: '',
                    oauth_token: '',
                    http_password: '',
                    http_username: '',
                    password: '',
                    email: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: 'Product line name cannot be empty', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: 'Description cannot be empty', trigger: 'blur' }
                    ],
                    salt_master_id: [
                        { required: true, message: 'Master ID cannot be empty', trigger: 'blur' }
                    ],
                    salt_master_url: [
                        { required: true, message: 'Master API Address cannot be empty', trigger: 'blur' }
                    ],
                    salt_master_user: [
                        { required: true, message: 'Master API Username can not be empty', trigger: 'blur' }
                    ],
                    salt_master_password: [
                        { required: true, message: 'Master API password can not be blank', trigger: 'blur' }
                    ],
                    gitlab_url: [
                        { required: true, message: 'GitLab Address cannot be empty', trigger: 'blur' }
                    ],
                    api_version: [
                        { required: true, message: 'GitLab API Version cannot be empty', trigger: 'blur' }
                    ],
                    private_token: [
                        { required: true, message: 'GitLab Token cannot be empty', trigger: 'blur' }
                    ],
                    state_project: [
                        { required: true, message: 'GitLab State cannot be empty', trigger: 'blur' }
                    ],
                    pillar_project: [
                        { required: true, message: 'GitLab Pillar cannot be empty', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            getProductEvent: function (productData, productId) {
                this.productData = productData;
                this.productId = productId;
            },
            // 调用子组件进行删除
            del () {
                this.$refs.childrenMethods.del(this.delId);
            },
            // 调用子组件进行数据刷新
            tableList () {
                this.$refs.childrenMethods.tableList();
            },
            // 调用子组件消息通知
            nError (title, info) {
                this.$refs.childrenMethods.nError(title, info);
            },
            // 添加展示
            add (name) {
                this.handleReset(name);
                this.optionType = 'add';
                this.optionTypeName = '添加';
                this.formView = true;
            },
            // 表单提
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.formValidate.file_server === 'rsync') {
                            this.formValidate.gitlab_url = '';
                            this.formValidate.api_version = '';
                            this.formValidate.private_token = '';
                            this.formValidate.state_project = '';
                            this.formValidate.pillar_project = '';
                        };
                        // 编辑
                        if (this.optionType === 'edit') {
                            this.axios.put(this.Global.serverSrc + this.apiService + '/' + this.id,
                                this.formValidate).then(
                                res => {
                                    if (res.data['status'] === true) {
                                        this.formView = false;
                                        this.$Message.success('success! ');
                                        this.tableList();
                                    } else {
                                        this.nError('Edit Failure', res.data['message']);
                                    }
                                },
                                err => {
                                    let errInfo = '';
                                    try {
                                        errInfo = err.response.data['message'];
                                    } catch (error) {
                                        errInfo = err;
                                    }
                                    this.nError('Edit Failure', errInfo);
                                });
                        } else {
                            // 添加
                            this.axios.post(this.Global.serverSrc + this.apiService,
                                this.formValidate).then(
                                res => {
                                    if (res.data['status'] === true) {
                                        this.formView = false;
                                        this.$Message.success('success! ');
                                        this.tableList();
                                    } else {
                                        this.nError('Add Failure', res.data['message']);
                                    }
                                },
                                err => {
                                    let errInfo = '';
                                    try {
                                        errInfo = err.response.data['message'];
                                    } catch (error) {
                                        errInfo = err;
                                    }
                                    this.nError('Add Failure', errInfo);
                                });
                        }
                    } else {
                        this.$Message.error('Please check the form data! ');
                    }
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    };
</script>
