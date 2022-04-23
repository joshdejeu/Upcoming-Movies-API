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
        
        <div id="add_sub">
            <h6>Adult: {{adultamt}}</h6>
            <div>
                <input id="add_btn" type="button" value="+" @click="addAdult">
                <input id="sub_btn" type="button" value="-" @click="subAdult">
            </div>
        </div>

        <div id="add_sub">
            <h6>Child: {{childamt}}</h6>
            <div>
                <input id="add_btn" type="button" value="+" @click="addChild">
                <input id="sub_btn" type="button" value="-" @click="subChild">
            </div>
        </div>

        <div>
            <h6 id="del" @click="remove">Remove</h6>
        </div>
    </div>
    `,
    props:['source','title','adultamt','childamt','tickobj'],
    data(){
        return{
            concact: "https://image.tmdb.org/t/p/w500",
            newAdult: this.adultamt,
            newChild: this.childamt
        }
    },
    methods:{
        addAdult(){
            this.newAdult++;
            this.$emit('tick_update', this.tickobj, this.newAdult, this.newChild, "fromCart");
        },
        subAdult(){
            this.newAdult--;
            this.$emit('tick_update', this.tickobj, this.newAdult, this.newChild, "fromCart");
        },
        addChild(){
            this.newChild++;
            this.$emit('tick_update', this.tickobj, this.newAdult, this.newChild, "fromCart");
        },
        subChild(){
            this.newChild--;
            this.$emit('tick_update', this.tickobj, this.newAdult, this.newChild, "fromCart");
        },
        remove(){
            this.$emit('tick_update', this.tickobj, 1, 1, "delete");
        }
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


// these are the movie cards under the big picture

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
        // default values on load, should be changed asap to API
        pageTitle: "Upcoming Movies",
        image: "images/wardogs.png",
        title: "War Dogs",
        rating: "9.4/10",
        desc: "This movie goated",
        tickets:
        [
            // {tick_src: "", tick_title: "", tick_Adult: 0, tick_Child: 0,}
        ],

        // movie titles from every ticket purchases 
        movieTitles: [],

        // red notification by shopping cart
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
        ticketUpdate(){

        },
        updateCart(obj, adult, child, key){
            const CONCACT = "https://image.tmdb.org/t/p/w500";
            // Parameters: 
            //      Object of movie, 
            //      adult ticket count, 
            //      child ticket count,

            // create an summary object that contains:
            //      movie img src,
            //      movie tite,
            //      adult ticket count,
            //      child ticket count,

            // Change source based on where function is called

            // Use key as GPS to know where it was called from 
            // objects has properties with different names for now
            // alert("change obj property names to be the same") 
            if(key=="fromCart" || key=="delete"){
                var source = obj.tick_src;
                var title = obj.tick_title;
            }else{
                var source = CONCACT+obj.poster_path;
                var title = obj.title;
            }



            // Make sure tickets can't be below 0
            if(adult<0){adult=0;}
            if(child<0){child=0;}



            var tick_obj = 
            {
                tick_src: source,
                tick_title: title,
                tick_Adult: adult,
                tick_Child: child,
            }
            // 2) check every item in array for current movie title
            for(i=0; i < this.tickets.length; i++){
                exits = false;
                // 3) if current movie title matches a movie title from array
                // 4) remove that current movie
                if(this.tickets[i].tick_title == title){this.tickets.splice(i,1);}
            }

            // 5) update movie array with new movie object
            this.tickets.push(tick_obj);

            // If delete text was clicked
            // for every movie in summary
            // check title if it matches then delete
            if(key=="delete"){
                for(i=0; i<this.tickets.length; i++){

                    if(this.tickets[i].tick_title == title){
                        this.tickets.splice(i,1);
                    }
                }
            }

            // If both adult tickets, and child tickets are 0
            // then remove the movie from the summary
            if(adult==0 && child==0){
                // check if adult is 0 first then delete
                //check if child is 0 then delete
                for(i=0; i<this.tickets.length; i++){
                    nowA = this.tickets[i].tick_Adult;
                    nowC = this.tickets[i].tick_Child;
                    if(nowA == 0 && nowC == 0){
                        this.tickets.splice(i,1);
                    }

                }
            }
            
            // 6) update movie ticket amount (red circle by shopping cart)
            this.ticketsBought++;

            // 7) if less than 0 tickets purchased, don't show notification
            var amt = document.getElementById('sum_amount');
            if(this.ticketsBought>0){amt.style.transform = "scale(1.0)";}
            else{amt.style.transform = "scale(0.0)";}
            amt.innerHTML = this.ticketsBought;
        },
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
