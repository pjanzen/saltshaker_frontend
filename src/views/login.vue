<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    welcome
                </p>
                <div class="form-con">
                    <Tabs v-model="tab" :style="[h]">
                        <TabPane label="login" name="login">
                            <Form ref="loginForm" :model="form" :rules="rules">
                                <FormItem prop="userName">
                                    <Input v-model="form.userName" placeholder="Username">
                                        <span slot="prepend">
                                            <Icon :size="16" type="person"></Icon>
                                        </span>
                                    </Input>
                                </FormItem>
                                <FormItem prop="password">
                                    <Input type="password" v-model="form.password" placeholder="Password">
                                        <span slot="prepend">
                                            <Icon :size="16" type="locked"></Icon>
                                        </span>
                                    </Input>
                                </FormItem>
                                <FormItem>
                                    <Button @click="handleSubmit" type="primary" long>Login</Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane label="Register" name="register">
                            <Form ref="registerForm" :model="registerForm" :rules="registerRules">
                                <FormItem prop="userName">
                                    <Input v-model="registerForm.userName" placeholder="Username">
                                        <span slot="prepend">
                                            <Icon :size="16" type="person"></Icon>
                                        </span>
                                    </Input>
                                </FormItem>
                                 <FormItem prop="mail">
                                     <Input v-model="registerForm.mail" placeholder="Email">
                                        <span slot="prepend">
                                            <Icon :size="16" type="email"></Icon>
                                        </span>
                                     </Input>
                                </FormItem>
                                <FormItem prop="password">
                                    <Input type="password" v-model="registerForm.password" placeholder="Password" >
                                        <span slot="prepend">
                                            <Icon :size="16" type="locked"></Icon>
                                        </span>
                                    </Input>
                                </FormItem>
                                <FormItem prop="rePassword">
                                    <Input type="password" v-model="registerForm.rePassword" placeholder="Retype password" >
                                        <span slot="prepend">
                                            <Icon :size="16" type="unlocked"></Icon>
                                        </span>
                                    </Input>
                                </FormItem>
                                <FormItem>
                                    <Button @click="handleRegister" type="primary" long>Register</Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                    </Tabs>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import jsEncrypt from 'jsencrypt/bin/jsencrypt';
export default {
    data () {
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            token: '',
            publicKey: this.RSA(),
            tab: 'login',
            h: {
                height: '209px'
            },
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: 'Username can not be empty', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Password can not be empty', trigger: 'blur' }
                ]
            },
            registerForm: {
                userName: '',
                password: '',
                mail: ''
            },
            registerRules: {
                userName: [
                    { required: true, message: 'Username can not be empty', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please enter your password', trigger: 'blur' },
                    { min: 6, message: 'Please enter at least 6 characters', trigger: 'blur' }
                ],
                rePassword: [
                    { required: true, message: 'Please enter your password again', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ],
                mail: [
                    { required: true, message: 'E-mail can not be empty', trigger: 'blur' },
                    { type: 'email', message: 'Invalid email address', trigger: 'blur' }
                ]
            }
        };
    },
    watch: {
        tab () {
            if (this.tab === 'login') {
                this.h.height = '209px';
            } else {
                this.h.height = '320px';
            }
        }
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // 使用rsa对密码进行加密
                    let jse = new jsEncrypt();
                    jse.setPublicKey(this.publicKey);
                    let passwordRsa = jse.encrypt(this.form.password);
                    this.$store.commit('setAvator', 'https://avatars2.githubusercontent.com/u/13944988?s=40&v=4');
                    let postData = {
                        'username': this.form.userName,
                        'password': passwordRsa
                    };
                    this.axios.post(this.Global.serverSrc + 'login', postData).then(
                        res => {
                            if (res.data['status'] === true) {
                                let info = res.data['data'];
                                Cookies.set('user', this.form.userName);
                                // 后端返回过期时间,单位秒 转换成天
                                let expireDays = info['token']['expires'] / 60 / 60 / 24;
                                Cookies.set(info['token']['key'], info['token']['value'], { expires: expireDays });
                                Cookies.set('tag', info['token']['key']);
                                // Cookies.set('access', 0);
                                // 设置UID
                                this.$store.commit('setUserId', info['user']['uid']);
                                // 存储在localStorage解决刷新页面vuex 的值消失的的问题
                                localStorage.user = info['user']['uid'];
                                // 存储菜单信息
                                localStorage.menu = info['user']['menu'];
                                // this.$store.commit('setUsername', this.form.userName);
                                // localStorage.username = this.form.userName;
                                this.$router.push({
                                    name: 'home_index'
                                });
                            } else {
                                this.nError('Login failed:', res.data['message']);
                            }
                        },
                        err => {
                            let errInfo = '';
                            try {
                                errInfo = err.response.data['message'];
                            } catch (error) {
                                errInfo = err;
                            }
                            this.nError('Login failed:', errInfo);
                        });
                }
            });
        },
        handleRegister () {
            this.$refs.registerForm.validate((valid) => {
                if (valid) {
                    // 使用rsa对密码进行加密
                    let jse = new jsEncrypt();
                    jse.setPublicKey(this.publicKey);
                    let passwordRsa = jse.encrypt(this.registerForm.password);
                    let postData = {
                        'username': this.registerForm.userName,
                        'password': passwordRsa,
                        'mail': this.registerForm.mail
                    };
                    this.axios.post(this.Global.serverSrc + 'user/register', postData).then(
                        res => {
                            if (res.data['status'] === true) {
                                this.$Message.success('registration success! ');
                                this.tab = 'login';
                                this.$refs['registerForm'].resetFields();
                            } else {
                                this.nError('registration failed:', res.data['message']);
                            }
                        },
                        err => {
                            let errInfo = '';
                            try {
                                errInfo = err.response.data['message'];
                            } catch (error) {
                                errInfo = err;
                            }
                            this.nError('registration failed:', errInfo);
                        });
                }
            });
        },
        // 重新定义错误消息
        nError (title, info) {
            this.$Notice.error({
                title: title,
                desc: info,
                duration: 10
            });
        },
        // 获取rsa 公钥
        RSA () {
            this.axios.get(this.Global.serverSrc + 'rsa').then(
                res => {
                    if (res.data['status'] === true) {
                        this.publicKey = res.data['data'];
                    } else {
                        this.nError('Registration failed to encrypt:', res.data['message']);
                    }
                },
                err => {
                    let errInfo = '';
                    try {
                        errInfo = err.response.data['message'];
                    } catch (error) {
                        errInfo = err;
                    }
                    this.nError('Encryption failed:', errInfo);
                });
        }
    }
};
</script>
