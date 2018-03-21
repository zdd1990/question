var app={};
//register:注册
app.register={};
// $(document).on('click','#registerFrm .save',function(){
//     var regFrm = document.querySelector('#registerFrm');
//     var data = {
//         username: regFrm.username.value,
//         phone: regFrm.phone.value,
//         email: regFrm.email.value,
//         password: regFrm.password.value,
//         repassword: regFrm.repassword.value
//     }
//     console.log(data)
// })

//personfile
// if (!Cookies.get('username')) {
//     // location.href = '/login.html';
// } else {
//     $('#username').html(Cookies.get('username'));
//     $('.login2').hide();
// }
// function logout() {
//     Cookies.remove('username');
//     location.reload();
// }
// var pf = Cookies.getJSON('userinfo');
// personfile.username.value = pf.username;
// personfile.phone.value = pf.phone;
// personfile.email.value = pf.email;
// personfile.password.value = pf.password;
// personfile.sex.value = pf.sex;
// personfile.partment.value = pf.partment;
// $('#personfile img').prop('src', './uploads/' + pf.photo);

// function uploads() {
//     var formData = new FormData();
//     formData.append('id', pf.id);
//     formData.append('images', myphoto.files[0]);
//     $.ajax({
//         url: '/uploads',
//         type: 'post',
//         cache: false,
//         processData: false,
//         data: formData,
//         success: function (result) {
//             if (result.error == 0) {
//                 $("#personfile img").prop('src', '/uploads/' + result.data);
//             }
//         }
//     });
// }


//management
// var vm = new Vue({
//     el: '#main',
//     data: {
//         addok: false,
//         editok: false,
//         users: [],
//         username: '',
//         phone: "",
//         email: "",
//         eusername: '',
//         ephone: "",
//         eemail: "",
//         eid: ''
//     },
//     created: function () {
//         //获取数据
//         var th = this;
//         $.get('/users/show', function (res) {
//             th.users = res.data;
//         });
//     },
//     methods: {
//         //删除
//         del: function (id) {
//             if (!confirm('确定删除吗')) {
//                 return;
//             }
//             var th = this;
//             $.get('/users/del', { id: id }, function (result) {
//                 //获取数据 
//                 $.get('/users/show', function (res) {
//                     th.users = res.data;
//                 });
//             })
//         },
//         ad: function () {
//             this.addok = true;
//         },
//         //添加
//         save: function () {
//             var th = this;
//             $.post('/users/add', {
//                 username: this.username,
//                 phone: this.phone,
//                 email: this.email
//             }, function (result) {
//                 //获取数据 
//                 $.get('/users/show', function (res) {
//                     th.users = res.data;
//                 });

//             });
//             this.addok = false;
//         },
//         close: function () {
//             this.addok = false;
//             this.editok = false;
//         },
//         //编辑
//         edit: function (id) {
//             this.editok = true;
//             var th = this;
//             //查询当前要编辑的数据
//             $.get('/users/getUsers', { id: id }, function (res) {
//                 th.eusername = res.data.username;
//                 th.ephone = res.data.phone;
//                 th.eemail = res.data.email;
//                 th.eid = id;
//             });

//         },
//         editsave: function () {
//             var th = this;
//             $.post('/users/editsave', {
//                 username: th.eusername,
//                 phone: th.ephone,
//                 email: th.eemail,
//                 id: th.eid
//             }, function (result) {
//                 //获取数据 
//                 $.get('/users/show', function (res) {
//                     th.users = res.data;
//                 });
//             });
//             this.eusername = '';
//             this.ephone = '';
//             this.eemail = '';
//             this.eid = '';
//             this.editok = false;
//         }
//     }
// });
// if (!Cookies.get('username')) {
//     location.href = '/login.html';
// } else {
//     $('#username').html(Cookies.get('username'));
//     $('.login2').hide();
// }