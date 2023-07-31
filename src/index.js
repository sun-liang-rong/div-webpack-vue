import { getProducts } from './data.js'
import './style/index.css'
import { utilDate } from 'utils/index.js'
import bgImg from './assets/images/bg.jpg'
console.log(getProducts())
const blogs = getProducts()
const ul = document.createElement('ul')
blogs.forEach(blog => {
  const li = document.createElement('li')
  li.innerHTML = blog
  ul.appendChild(li)
})
document.body.appendChild(ul)
const img = document.createElement('img')
img.src = bgImg
img.style.width = '500px'
img.style.height = '300px'
img.style.objectFit = 'cover'
document.body.prepend(img)
const h1 = document.createElement('h1')
h1.innerHTML = 'Hello Webpack'
document.body.prepend(h1)
const h2 = document.createElement('h2')
h2.innerHTML = utilDate()
document.body.prepend(h2)