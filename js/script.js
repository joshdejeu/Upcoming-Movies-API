// Code by Josh Dejeu
Vue.component("sumarray",{
    // container for each div created
    template:`
    <div class="ticketPurchase" :id=title>
        <div>
            <img :src=concact+source id="sum_img">
        </div>

        <div>
            <h6>{{title}}</h6>
        </div>

        <div>
            <h6>{{type}}</h6>
        </div>
        
        <div>
            <h6>{{amount}}</h6>
        </div>
    </div>
    `,
    props:['source','title','type','amount'],
    data(){
        return{
            concact: "https://image.tmdb.org/t/p/w500",
        }
    },
    methods:{

    }
})


Vue.component("ticket",{
    // container for each div created
    template:`
    <div class="smallInfo">
        <h3 id="h3">Buy Tickets!</h3>
        <div id="small_btnCont">
            <input type="button" value="Adult" id="tick" @click="adultBuy">
            <input type="button" value="Child" id="tick" @click="childBuy">
        </div>
        <div id="small_h4Cont">
            <h4 id="h4">$10.99</h4>
            <h4 id="h4">$4.99</h4>
        </div>
    </div>
    `,
    methods:{
        adultBuy(){
            this.buyAnimaiton();
            this.$emit('adultTicket');
        },
        childBuy(){
            this.buyAnimaiton();
            this.$emit('childTicket');
        },
        buyAnimaiton(){
            e = window.event;
            var ocont = document.getElementById('o_container');
            o = document.createElement('div');
            o.className = "o";
            o.style.visibility = "visible";
            o.style.transition = ""; 
            o.style.left = e.pageX-40 + 'px';
            o.style.top = e.pageY-25 + 'px';
            ocont.appendChild(o);
            if(ocont.children.length>7){ocont.firstChild.remove();}
            setTimeout(function(){
                o.style.left = '15px';
                o.style.top = '20px';   
                o.style.transition = "all 0.8s cubic-bezier(.47,-0.04,.58,.29)"; 
            },100)
        }
    }
});


Vue.component("movie",{
    // container for each div created
    template:`
    <div class="smallPic" @click="clock(obj)" @mouseover="hover = true" @mouseleave="hover = false">
        <ticket @adultTicket="adultBought" @childTicket="childBought" v-if="hover"></ticket>
        <img v-bind:src=concact+source id="img">
    </div>`,
    // data passed in from HTML for each loop
    props:['source', 'title', 'desc', 'obj'],
    data(){
        return{
            concact: "https://image.tmdb.org/t/p/w500",
            hover: false,
            ticketAdult: 0,
            ticketChild: 0,
            movObj: this.obj,
        }
    },
    methods:{
        clock(that){
            // updates big picture with information of what was 'clicked'
            movie.image =  "https://image.tmdb.org/t/p/w500"+this.source;
            movie.title = this.title;
            movie.desc = this.desc.slice(0,200)+"...";
            movie.rating = that.vote_average;
            rate(that.vote_average);
        },
        adultBought(){
            this.ticketAdult++;
            this.$emit("secondadult", this.movObj, this.ticketAdult, this.ticketChild);
        },
        childBought(){
            this.ticketChild++;
            this.$emit("secondchild", this.movObj, this.ticketAdult, this.ticketChild);
        },
    }
})
 

// creating Vue object for big movie picture
const movie = new Vue({
    el: "#mainContainer",
    data:{
        pageTitle: "Upcoming Movies",
        image: "images/wardogs.png",
        title: "War Dogs",
        rating: "9.4/10",
        desc: "This movie goated",
        adultPurchased: [],
        childPurchased: [],
        totalPurchased: [],
        movieTitles: [],
        ticketsBought: 0,
        movies:
        [
            // {image: "images/21.png", title: "21 Jump Street", rating: "9.5/10", desc: "This movie goofy"},
            // {image: "images/central.png", title: "Central Intelligence", rating: "6.8/10", desc: "This movie goofy x2"},
            // {image: "images/jumanji.png", title: "Jumanji", rating: "8.6/10", desc: "This movie mid"},
            // {image: "images/wardogs.png", title: "War Dogs", rating: "9.4/10", desc: "This movie goated"},
            // {image: "images/yet.png", title: "Are We There Yet?", rating: "10/10", desc: "This movie goated x2"},
            // {image: "images/ted.png", title: "Ted", rating: "7.6/10", desc: "This movie mid x2"},
        ]
    },
    mounted(){
        link = "https://api.themoviedb.org/3/movie/now_playing?api_key=ab1f4dbc082f96d0289af4a0c5cf5a52&language=en-US&page=1"
        axios.get(link)
        .then((res)=>{
            console.log("API Response",res);
            this.movies = res.data.results;
            console.log("Object Array",this.movies);
        })
        .catch(error=>{console.log(error);})
    },
    methods:{
        // push movie objects into arrays
        addAdult(obj, adult, child){
            this.adultPurchased.push(obj);
            this.totalPurchased.push(obj);
            this.checkRepeat();
        },
        addChild(obj, adult, child){
            this.childPurchased.push(obj);
            this.totalPurchased.push(obj);
            this.checkRepeat();
        },
        checkRepeat(){
            // update movie ticket amount (red circle by shopping cart)
            this.ticketsBought++;
            var amt = document.getElementById('sum_amount');
            if(this.ticketsBought>0){amt.style.transform = "scale(1.0)";}
            else{amt.style.transform = "scale(0.0)";}
            amt.innerHTML = this.ticketsBought;

            // put all purchased movie titles into an array then remove repeating values
            console.log("Lenth of totalPurchased: ", this.totalPurchased.length)

            for(i=0;i<this.totalPurchased.length;i++){this.movieTitles.push(this.totalPurchased[i].title);}
            console.log("Lenth of movieTitles: ", this.movieTitles.length)
            uniqueTitles = [...new Set(this.movieTitles)];

            for(i=0;i<this.movies.length;i++){
                console.log("TITLE",this.movies[i].title)
                console.log("UNIQUE",uniqueTitles[i],"\n")
                console.log(typeof uniqueTitles[i] !== "undefined")
                if(typeof uniqueTitles[i] !== "undefined" && this.movies[i].title == uniqueTitles[i]){
                    console.log("Match found")
                }else{
                    break;
                }
            }

            // this.totalPurchased = uniqueTitles;
            console.log(uniqueTitles,"TAT");
            console.log(this.totalPurchased)

        }
    }
})




// change big picture when small picture is clicked
function updateMovie(theObj){
    imgLink = getLink(theObj);
    movie.image = imgLink;
    movie.title = movie.movies[theObj.id].title;
    movie.rating = movie.movies[theObj.id].rating;
    movie.desc = movie.movies[theObj.id].desc;
    rate(movie.rating.slice(0,-3));
}

// reformat from backgroundImage to img:src
function getLink(laObj){
    laLink = laObj.style.backgroundImage;
    console.log("\nOld Link: ", laLink);
    laLink = laLink.slice(5);
    laLink = laLink.slice(0,-2);
    console.log("New Link: ", laLink);
    return laLink;
}

// changing innerHTML of stars based on rating of movie
var star = document.getElementById('stars');
function rate(rating){
    rating = Math.round(rating);
    star.innerHTML = "";
    for(i=0;i<rating;i++){star.innerHTML = star.innerHTML+"★";}
    for(i=rating;i<10;i++){star.innerHTML = star.innerHTML+"☆";}
}