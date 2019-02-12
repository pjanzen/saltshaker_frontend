<template>
    <div>
        <common-table :cColumns="cColumns" :apiService="apiService" ref="childrenMethods" :productShow="true"></common-table>
        <Modal width="650px" v-model="showInfo" title="Return result" >
            <pre style="overflow:auto">
{{result}}
            </pre>
            <div slot="footer"></div>
        </Modal>
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
                apiService: 'job/manager',
                showInfo: false,
                minion: [],
                tmp: '',
                // 删除数据
                delId: '',
                delIndex: '',
                result: '',
                cColumns: [
                    {
                        title: 'Job ID',
                        key: 'Jid',
                        sortable: true,
                        width: 175
                    },
                    {
                        title: 'User',
                        key: 'User',
                        sortable: true,
                        width: 85
                    },
                    {
                        title: 'Minion / PPid',
                        key: 'Running',
                        sortable: true,
                        width: 275,
                        render: (h, params) => {
                            return h('ul', params.row.Running.map(item => {
                                return h('li', {
                                    style: {
                                        textAlign: 'left',
                                        padding: '0px'
                                    }
                                }, Object.keys(item)[0] + ' : ' + Object.values(item)[0]);
                            })
                            );
                        }
                    },
                    {
                        title: 'Function',
                        key: 'Function',
                        sortable: true,
                        width: 110
                    },
                    {
                        title: 'Arguments',
                        key: 'Arguments',
                        sortable: true
                    },
                    {
                        title: 'StartTime',
                        key: 'StartTime',
                        sortable: true,
                        render: (h, params) => {
                            return this.convertTime(params.row.StartTime);
                        }
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: 'Really Kill JobID: ' + params.row.Jid + ' ?',
                                        transfer: true,
                                        placement: 'top-end'
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.delId = params.row.Jid;
                                            this.delIndex = params.index;
                                            this.minion = [];
                                            this.minion = params.row.Running;
                                            this.kill();
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        }
                                    }, 'Kill')
                                ])
                            ]);
                        }
                    }
                ]
            };
        },
        methods: {
            // 调用子组件进行kill
            kill () {
                this.$refs.childrenMethods.kill(this.delId, this.minion);
            },
            // 2018, Apr 18 20:30:48.960755 to yyyy-mm-dd hh:mm:ss
            convertTime (time) {
                let dt = new Date(time);
                let date = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
                return date;
            }
        }
    };
</script>
