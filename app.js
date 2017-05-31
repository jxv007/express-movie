//导入依赖模块
var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// 链接数据库
var Movie = require('./models/movie');
mongoose.connect('mongodb://localhost/express-demo');
// var movieExample = new Movie({
//     doctor: '成龙',
//     title: '尖峰时刻',
//     language: 'China',
//     country: '中国',
//     poster: null,
//     summary: '惊心动魄的故事',
//     year: 2004
// })
// movieExample.save(function (error, doc) {
//     if (error) {
//         console.log(error)
//     } else {
//         console.log(doc)
//     }
// })
//设置端口
var port = process.env.PORT || 8100;
var app = express();
app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public'))) // 设置静态目录
app.listen(port, () => {
    console.log('server running on port: ' + port);
});


// index page
app.get('/', (req, res) => {
    Movie.fetch((error, movies) => {
        if (error) {
            console.log(error)
        } else {
            res.render('index', {
                title: '首页',
                movies: movies
            })
        }
    })
});

// detail page
app.get('/movie/:id', (req, res) => {
    var id = req.params.id;
    Movie.findById(id, (error, movie) => {
        res.render('detail', {
            title: '详情页 > ' + movie.title,
            movie: movie
        })
    })
});

// admin page
app.get('/admin/movie', (req, res) => {
    res.render('admin', {
        title: '后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
});

// admin update movie
app.get('/admin/update/:id', (req, res) => {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, (error, movie) => {
            res.render('admin', {
                title: '更新页' + movie.title,
                movie: movie
            })
        })
    }
})
// admin post movie
app.post('/admin/movie/new', (req, res) => {
    var id = req.body.movie._id
    var movieObj = req.body.movie;
    var _movie;
    if (id !== 'undefined') {
        Movie.findById(id, (error, movie) => {
            if (error) {
                console.log(error)
            }
            _movie = Object.assign(movie, movieObj);
            _movie.save((error, movie) => {
                if (error) {
                    console.log(error)
                }
                res.redirect('/movie/' + movie._id)
            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            poster: movieObj.poster,
            year: movieObj.year,
            language: movieObj.language,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        _movie.save((error, movie) => {
            if (error) {
                console.log(error)
            }
            res.redirect('/movie/' + movie._id)
        })
    }
})

// list page
app.get('/admin/list', (req, res) => {
    Movie.fetch((error, movies) => {
        if (error) {
            console.log(error)
        } else {
            res.render('list', {
                title: '当前电影列表',
                movies: movies
            })
        }

    })
});

// list delete movie
app.delete('/admin/list', (req, res) => {
    var id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, (error, movie) => {
            if (error) {
                console.log(error)
            } else {
                res.json({success: 1})
            }
        })
    }
})