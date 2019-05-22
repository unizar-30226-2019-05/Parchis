let a = [1, 2, 3]
let b = a
a[0] = 3
console.log(a[0])
console.log(b[0])


let c = [1, 2, 3]
let d = Array.from(c)
c[0] = 3
console.log(c[0])
console.log(d[0])


const Estado = require('./Estado.js')

let estado1 = new Estado(null, null, null, null, null, 3, null)
let estado2 = estado1
console.log(estado2.turno)
estado1.turno = 1
console.log(estado2.turno)


let estado3 = new Estado(null, null, null, null, null, 3, null)
let estado4 = Object.assign(new Estado(), estado3)
console.log(estado4.turno)
estado3.turno = 1
console.log(estado3.turno)
console.log(estado4.turno)


class Test{
    constructor(v){
        this.tabla = v
    }
    hash(){
        return 0;
    }
}

let t1 = new Test([[4], [5], [6]])


console.log("---------")

const clonedeep = require('lodash.clonedeep')

a = [ [1], [3], [4] ]
b = clonedeep(a)
a[0][0] = 3
console.log(a[0][0] + " " + b[0][0])