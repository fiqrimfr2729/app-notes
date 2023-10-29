const fs = require('fs');

const dirPath = './data'
const dataPath = './data/data.json'

if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
}

if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const loadData = () => {
    const fileBuffer = fs.readFileSync(dataPath, 'utf-8')
    const students = JSON.parse(fileBuffer)
    return students
}

const saveData = (students) => {
    fs.writeFileSync(dataPath, JSON.stringify(students), 'utf-8')
}

const findData = (nim) => {
    const students = loadData()
    const student = students.find((student) => student.nim === nim)
    return student
}

const addData = (student) => {
    const students = loadData()
    students.push(student)
    
    saveData(students)
}

const checkDuplicate = (nim) => {
    const students = loadData()
    return students.find((student) => student.nim === nim)
}

const deleteData = (nim) => {
    const students = loadData()
    let newStudents = students.filter((student) => student.nim !== nim)
    saveData(newStudents)
}

const updateData = (nim, student) => {
    let students = loadData()
    let index = students.findIndex(student => student.nim === nim)
    console.log(index);
    students[index] = student
    saveData(students)
}

module.exports = {loadData, findData, addData, checkDuplicate, deleteData, updateData}

