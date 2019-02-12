<template>
    <div>
        <common-table :cColumns="cColumns" :apiService="apiService" @getProductEvent="getProductEvent" :productShow="true" ref="childrenMethods">
            <Button slot="create" type="primary" @click="add('formValidate')">Create a group</Button>
            <Modal slot="option" v-model="formView"  :title="optionTypeName" width="650px">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60">
                    <FormItem label="Group name" prop="name">
                        <Input v-model="formValidate.name" placeholder="Enter group name"></Input>
                    </FormItem>
                    <FormItem label="description" prop="description">
                        <Input v-model="formValidate.description" placeholder="Group description"></Input>
                    </FormItem>
                    <FormItem label="Host" prop="host">
                        <Transfer
                            :data="originMinion"
                            :target-keys="targetMinion"
                            :list-style="listStyle"
                            :render-format="renders"
                            :titles = "titles"
                            filterable
                            @on-change="handleChange">
                            <!--<div :style="{float: 'right', margin: '5px'}">-->
                                <!--<Button type="ghost" size="small" @click="reloadMockData">Refresh</Button>-->
                            <!--</div>-->
                            <!--<div :style="{float: 'left', margin: '5px'}">-->
                                <!--<Select style="width:176px" size="small" v-model="groupsId" placeholder="Please select a group">-->
                                    <!--<Option v-for="item in groupsData" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                                <!--</Select>-->
                            <!--</div>-->
                        </Transfer>
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
                apiService: 'groups',
                productData: [],
                productId: '',
                groupsData: [],
                groupsId: '',
                // 删除数据
                delId: '',
                delIndex: '',
                // 编辑数据
                formView: false,
                optionType: '',
                optionTypeName: '',
                cColumns: [
                    {
                        title: 'Group name',
                        key: 'name',
                        sortable: true,
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
                        sortable: true
                    },
                    {
                        title: 'Host',
                        key: 'minion',
                        sortable: true,
                        render: (h, params) => {
                            return h('ul', params.row.minion.map(item => {
                                return h('li', {
                                    style: {
                                        textAlign: 'left',
                                        padding: '0px'
                                    }
                                }, item);
                            })
                            );
                        }
                    },
                    {
                        title: 'operating',
                        key: 'action',
                        width: 123,
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
                                            this.handleReset('formValidate');
                                            this.optionType = 'edit';
                                            this.optionTypeName = '编辑';
                                            // this.targetMinion = [];
                                            this.groupsId = params.row.id;
                                            this.getTargetMinion();
                                            this.formValidate.name = params.row.name;
                                            this.formValidate.description = params.row.description;
                                            this.formValidate.productId = params.row.product_id;
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
                    productId: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: 'Group name cannot be empty', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: 'Description cannot be empty', trigger: 'blur' }
                    ]
                },
                // 穿梭框
                originMinion: [],
                targetMinion: [],
                titles: ['To be added to the host', 'Current grouping'],
                listStyle: {
                    width: '250px',
                    height: '230px'
                }
            };
        },
        watch: {
            productId () {
                this.originMinion = [];
                this.getOriginMinion();
            }
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
                this.optionTypeName = 'add';
                this.formView = true;
                this.originMinion = [];
                this.targetMinion = [];
                this.getOriginMinion();
            },
            // 表单提
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // 编辑
                        let postData = {
                            'name': this.formValidate.name,
                            'description': this.formValidate.description,
                            'product_id': this.productId,
                            'minion': this.targetMinion
                        };
                        if (this.optionType === 'edit') {
                            this.axios.put(this.Global.serverSrc + this.apiService + '/' + this.groupsId,
                                postData).then(
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
                                postData).then(
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
            // 表单重置
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            // 穿梭框
            getOriginMinion () {
                this.axios.get(this.Global.serverSrc + 'host?product_id=' + this.productId).then(
                    res => {
                        if (res.data['status'] === true) {
                            for (var i = 0; i < res.data['data'].length; i++) {
                                this.originMinion.push({
                                    key: res.data['data'][i]['minion_id']
                                });
                            }
                        } else {
                            this.nError('Get Info Failure', res.data['message']);
                        };
                    },
                    err => {
                        let errInfo = '';
                        try {
                            errInfo = err.response.data['message'];
                            if (err.response.status === 404) {
                                this.originMinion = [];
                            } else {
                                this.nError('Get Info Failure', errInfo);
                            }
                        } catch (error) {
                            errInfo = err;
                            this.nError('Get Info Failure', errInfo);
                        }
                    });
            },
            groupList () {
                this.axios.get(this.Global.serverSrc + this.apiService + '?product_id=' + this.productId).then(
                    res => {
                        if (res.data['status'] === true) {
                            this.groupsData = res.data['data'];
                        } else {
                            this.nError('Get Groups Failure', res.data['message']);
                        }
                    },
                    err => {
                        let errInfo = '';
                        try {
                            errInfo = err.response.data['message'];
                        } catch (error) {
                            errInfo = err;
                        }
                        this.nError('Get Groups Failure', errInfo);
                    });
            },
            getTargetMinion () {
                this.axios.get(this.Global.serverSrc + 'groups/' + this.groupsId).then(
                    res => {
                        if (res.data['status'] === true) {
                            this.targetMinion = res.data['data']['minion'];
                        } else {
                            this.nError('Get Info Failure', res.data['message']);
                        };
                    },
                    err => {
                        let errInfo = '';
                        try {
                            errInfo = err.response.data['message'];
                            if (err.response.status === 404) {
                                this.targetMinion = [];
                            } else {
                                this.nError('Get Info Failure', errInfo);
                            }
                        } catch (error) {
                            errInfo = err;
                            this.nError('Get Info Failure', errInfo);
                        }
                    });
            },
            handleChange (newTargetMinion) {
                this.targetMinion = newTargetMinion;
            },
            renders (item) {
                return item.key;
            }
        }
    };
</script>
