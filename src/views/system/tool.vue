<template>
    <div>
        <Row class="margin-top-10">
            <Card dis-hover>
                <p slot="title">
                    System Tool
                </p>
                <Table :columns="columns" :data="jobData" :border="true"></Table>
            </Card>
        </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                jobData: this.tableList(),
                columns: [
                    {
                        title: 'service',
                        key: 'service'
                    },
                    {
                        title: 'status',
                        key: 'status',
                        render: (h, params) => {
                            let tagColor = 'green';
                            let info = '';
                            if (params.row.status === 'Down') {
                                tagColor = 'red';
                                info = 'failure';
                            }
                            if (params.row.status === 'Up') {
                                tagColor = 'green';
                                info = 'normal';
                            }
                            if (params.row.status === 'Missing') {
                                tagColor = 'yellow';
                                info = 'missing';
                            }
                            if (params.row.status === 'More') {
                                tagColor = 'yellow';
                                info = 'excessive';
                            }
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        'color': tagColor
                                    }
                                }, info)
                            ]);
                        }
                    },
                    {
                        title: 'Pid',
                        key: 'status',
                        render: (h, params) => {
                            return h('ul', params.row.pid.map(item => {
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
                        title: 'option',
                        key: 'option',
                        render: (h, params) => {
                            let start = true;
                            let stop = false;
                            if (params.row.status === 'Up' || params.row.status === 'More') {
                                start = true;
                            } else {
                                start = false;
                            }
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: start
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleEvent('start');
                                        }
                                    }
                                }, 'start up'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        disabled: stop
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleEvent('stop');
                                        }
                                    }
                                }, 'stop')
                            ]);
                        }
                    }
                ]
            };
        },
        methods: {
            tableList () {
                this.axios.get(this.Global.serverSrc + 'sse/status').then(
                    res => {
                        if (res.data['status'] === true) {
                            this.jobData = res.data['data'];
                        } else {
                            this.nError('Get Info Failure', res.data['message']);
                        };
                    },
                    err => {
                        let errInfo = '';
                        try {
                            errInfo = err.response.data['message'];
                            if (err.response.status === 404) {
                                this.jobData = [];
                            } else {
                                this.nError('Get Info Failure', errInfo);
                            }
                        } catch (error) {
                            errInfo = err;
                            this.nError('Get Info Failure', errInfo);
                        }
                        this.jobData = [];
                    });
            },
            handleEvent (action) {
                this.axios.get(this.Global.serverSrc + 'sse?action=' + action).then(
                    res => {
                        if (res.data['status'] === true) {
                            this.$Message.success('success! ');
                            this.tableList();
                        } else {
                            this.nError('Event Action Failure', res.data['message']);
                        }
                    },
                    err => {
                        let errInfo = '';
                        try {
                            errInfo = err.response.data['message'];
                        } catch (error) {
                            errInfo = err;
                        }
                        this.nError('Event Action Failure', errInfo);
                    });
            },
            // 重新定义错误消息
            nError (title, info) {
                this.$Notice.error({
                    title: title,
                    // 替换<>避免被解析为html标签
                    desc: info.toString().replace(/<|>/g, ''),
                    duration: 10
                });
            },
        }
    };
</script>
