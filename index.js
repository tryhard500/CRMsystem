const express = require('express');
const app = express();
const port = 3000;

app.listen(port,function(){
	console.log(`Сервер запущен: http://localhost:${port}`);
});

//подключение статических данных
app.use(express.static('public')); 

//подключение post запросов
app.use(express.urlencoded({extended: true}));

//Подключение hbs
const hbs = require('hbs');
app.set('views','views');
app.set('view engine','hbs');

//Подключение библиотеки faker
const { faker } = require('@faker-js/faker');
const { log } = require('console');

let items = [];
for (let i = 0; i < 20; i++){
    let sex = faker.name.sex();
    items.push({
        id: i,
        img: faker.image.cats(300,300,true),
        name: faker.name.firstName(sex),
        sex: sex,
        age: faker.datatype.number({max:20}),
        breed: faker.animal.cat(),
        isActive: faker.datatype.boolean(),
        isWanted: faker.datatype.boolean()
    });
}

app.get('/',(req,res)=>{
    let active = req.query.active;
    if (!active) {
        res.render('index',{items: items});
    } else if (active == 'true') {
        let item = [];
        for (let i = 0; i < items.length; i++){
            if (items[i].isActive) {
                item.push(items[i]);
            }
        }
        res.render('index',{items: item});
    } else if (active == 'false') {
        let item = [];
        for (let i = 0; i < items.length; i++){
            if (!items[i].isActive) {
                item.push(items[i]);
            }
        }
        res.render('index',{items: item});
    }
});

app.get('/admin',(req,res)=>{
    res.render('admin',{items: items})
});

app.post('/add',(req,res)=>{
    let {name, age, sex, breed} = req.body;
    items.push({
        id: items.length,
        img: faker.image.cats(300,300,true),
        name: name,
        sex: sex,
        age: age,
        breed: breed,
        isActive: true,
        isWanted: false
    });
    res.redirect('admin')
});

app.get('/home',(req,res)=>{
    let id = req.query.id;
    let item = items[id];
    if (item) {
        item.isWanted = true;
        res.redirect('/')
    }
});

app.get('/admin-home',(req,res)=>{
    let id = req.query.id;
    let item = items[id];
    if (item) {
        item.isActive = false;
        item.isWanted = false;
        res.redirect('admin');
    }
});