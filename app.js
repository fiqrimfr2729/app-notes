const express = require('express'); 
const fs = require('fs');
const {body, validationResult, check} = require('express-validator')
const expressLayouts = require('express-ejs-layouts')
const {loadData, findData, addData, checkDuplicate, deleteData, updateData} = require('./utils/student');
const e = require('express');
const { redirect } = require('express/lib/response');

const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded())


app.get('/', (req, res) => {
    const students = [
        {
            name: 'Fiqri',
            nim: 1705011
        },
        {
            name: 'Rahardian',
            nim: 1705012
        }
    ]

    const data = {
        title: "Halaman Home",
        students,
        nama: "Fiqri",
        layout: "layouts/main"
    }
    res.render('index', data)
})

app.get('/about', (req, res) => {
    const data = {
        title: "Halaman About",
        nama: "Fiqri",
        layout: 'layouts/main'
    }
    
    res.render('about', data)
})

app.post('/student', [
    body('nim').custom((nim) => {
        const duplicate = checkDuplicate(nim)
        if(duplicate){
            throw new Error('NIM sudah terdaftar')
        }
        return true
    }),
    check('nim', 'NIM harus berupa angka').isNumeric()
] , (req, res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array(  )})
        const data = {
            title: "Halaman Tambah Data",
            layout: 'layouts/main',
            errors: errors.array()
        }
        res.render('add-student', data)
    }else{
        addData(req.body)
        res.redirect('/list-students')
    }
})

app.get('/list-students', (req, res) => {
    const students = loadData()
    const data = {
        title: "Halaman Mahasiswa",
        nama: "Fiqri",
        layout: 'layouts/main',
        students
    }
    
    res.render('list-students', data)
})

app.get('/student/add', (req, res) => {
    const data = {
        title: "Halaman Tambah Data",
        layout: 'layouts/main'
    }

    res.render('add-student', data)
})

app.post('/student/update', [
    body('nim').custom((nim) => {
        const duplicate = checkDuplicate(nim)
        if(duplicate){
            throw new Error('NIM sudah terdaftar')
        }
        return true
    }),
    check('nim', 'NIM harus berupa angka').isNumeric()
],(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array(  )})
        const data = {
            title: "Halaman Tambah Data",
            layout: 'layouts/main',
            errors: errors.array(),
        }
        res.redirect(`edit-student/${req.body.old_nim}`, data)
    }else{
        addData(req.body)
        res.redirect('/list-students')
    }
    updateData(req.body.old_nim, {name : req.body.name, nim : req.body.nim})

    res.redirect('/list-students')
})

app.get('/student/delete/:nim', (req, res) => {
    deleteData(req.params.nim)

    res.redirect('/list-students')
})

app.get('/student/edit/:nim', (req, res) => {
    let student = findData(req.params.nim)

    const data = {
        title: "Halaman Detail Mahasiswa",
        layout: 'layouts/main',
        student
    }

    res.render('edit-student', data)
})

app.get('/detail-student/:nim', (req, res) => {
    let student = findData(req.params.nim)
    const data = {
        title: "Halaman Detail Mahasiswa",
        layout: 'layouts/main',
        student
    }

    res.render('detail-student', data)
})

app.get('/home', (req, res) => {
    res.render('home')
})

app.listen(port, () => {
    console.log('Example app listening at port 3000');
})